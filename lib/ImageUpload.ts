const stripQueryParameters = (url: string): string => {
  return url.split('?')[0];
};

const onUpload = async (file: File): Promise<string> => {
  const currentDatetime = new Date().toISOString().replace(/[:.]/g, '-');
  const filenameWithDatetime = `${currentDatetime}_${file.name}`;
  const response = await fetch('/api/blog/files/signed-url', {
    method: 'POST',
    body: JSON.stringify({ filename: filenameWithDatetime, filetype: file.type }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error("Failed to get signed URL.");
  }

  const data = await response.json();
  const signedUrl = data.signedUrl;
  const uploadResponse = await fetch(signedUrl, {
    method: 'PUT',
    body: file
  });

  if (!uploadResponse.ok) {
    console.log(uploadResponse.body);
    throw new Error("Error occurred during file upload.");
  }

  const publicUrl = stripQueryParameters(signedUrl);
  return publicUrl;
};

export default onUpload;