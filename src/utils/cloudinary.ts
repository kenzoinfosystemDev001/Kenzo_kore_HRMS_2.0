export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  bytes?: number;
  format?: string;
}

/**
 * Uploads a local file to Cloudinary via backend API or direct upload
 */
export async function uploadFileToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target?.result as string;
      if (!fileData) {
        return reject(new Error('Failed to read file contents.'));
      }

      // 1. Primary path: Upload via Express server backend endpoint
      try {
        const response = await fetch('/api/upload-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileData,
            fileName: file.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            return resolve({
              url: data.url,
              publicId: data.publicId,
              bytes: data.bytes || file.size,
              format: data.format,
            });
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('Backend Cloudinary upload returned non-OK response:', response.status, errData);
        }
      } catch (backendErr) {
        console.warn('Backend upload API error, trying direct Cloudinary API upload:', backendErr);
      }

      // 2. Fallback: Direct upload to Cloudinary HTTP API if backend endpoint is unavailable
      try {
        const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || 'rhyn1n8t';
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'unsigned_preset'); // Cloudinary direct upload fallback

        const directRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
          method: 'POST',
          body: formData,
        });

        if (directRes.ok) {
          const directData = await directRes.json();
          return resolve({
            url: directData.secure_url,
            publicId: directData.public_id,
            bytes: directData.bytes || file.size,
            format: directData.format,
          });
        }
      } catch (directErr) {
        console.error('Direct Cloudinary upload failed:', directErr);
      }

      reject(new Error('Failed to upload file to Cloudinary. Please check file size and server connection.'));
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Deletes a document from Cloudinary by its publicId
 */
export async function deleteFileFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return true;
  try {
    const response = await fetch('/api/delete-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.success === true;
    }
  } catch (err) {
    console.error('Error deleting document from Cloudinary:', err);
  }
  return false;
}
