import { Client, Account, Databases, Storage } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69383428003dcfdb1127');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration IDs
export const DATABASE_ID = '6938347800097511ed3b';
export const COLLECTION_PRODUCTS = 'products';
export const BUCKET_IMAGES = 'products'; // ID du bucket créé dans la console