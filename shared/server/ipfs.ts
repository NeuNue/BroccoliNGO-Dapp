import Arweave from "arweave";

let arweave: Arweave;
export const getArweaveClient = () => {
  const key = JSON.parse(process.env.ARWEAVE_KEY ?? "{}");
  arweave = Arweave.init({
    host: "arweave.net", // Hostname or IP address for a Arweave host
    port: 443, // Port
    protocol: "https", // Network protocol http or https
    timeout: 20000, // Network request timeouts in milliseconds
    logging: false,
  });

  return {
    arweave,
    key,
  };
};

export const uploadToArweave = async (
  buffer: Buffer | ArrayBuffer,
  contentType = "application/octet-stream"
) => {
  const { arweave, key } = getArweaveClient();
  // create a data transaction
  const transaction = await arweave.createTransaction(
    {
      data: buffer,
    },
    key
  );

  // add a custom tag that tells the gateway how to serve this data to a browser
  transaction.addTag("Content-Type", contentType);
  transaction.addTag("Timestamp", Date.now().toString());

  // you must sign the transaction with your key before posting
  await arweave.transactions.sign(transaction, key);
  const response = await arweave.transactions.post(transaction);
  return {
    transaction,
    response,
  };
};

export interface UploadProgress {
  uploadedChunks: number;
  totalChunks: number;
  percent: number;
}

export const uploadToArweaveLargeFile = async (
  buffer: Buffer | ArrayBuffer,
  contentType = "application/octet-stream",
  onProgress?: (progress: UploadProgress) => void
) => {
  const { arweave, key } = getArweaveClient();
  // create a data transaction
  const transaction = await arweave.createTransaction(
    {
      data: buffer,
    },
    key
  );

  // add a custom tag that tells the gateway how to serve this data to a browser
  transaction.addTag("Content-Type", contentType);
  transaction.addTag("Timestamp", Date.now().toString());

  // you must sign the transaction with your key before posting
  await arweave.transactions.sign(transaction, key);

  // Get uploader
  const uploader = await arweave.transactions.getUploader(transaction);

  // Upload chunks with progress
  while (!uploader.isComplete) {
    await uploader.uploadChunk();

    if (onProgress) {
      onProgress({
        uploadedChunks: uploader.uploadedChunks,
        totalChunks: uploader.totalChunks,
        percent: Math.round(
          (uploader.uploadedChunks / uploader.totalChunks) * 100
        ),
      });
    }
  }

  // Verify upload
  const status = await arweave.transactions.getStatus(transaction.id);
  const is2xxStatus = status.status >= 200 && status.status < 300;
  console.log('--- is2xxStatus', is2xxStatus)
  const response = { status: is2xxStatus ? 200 : 500 };

  return {
    transaction,
    response,
  };
};
