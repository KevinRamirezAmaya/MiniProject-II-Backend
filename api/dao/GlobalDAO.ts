import { Document, Model, FilterQuery } from 'mongoose';

/**
 * Generic Data Access Object (DAO) class.
 * 
 * Provides reusable CRUD operations for any Mongoose model.
 * Specific DAOs (e.g., UserDAO) should extend this class
 * and inject their model via the constructor.
 */
export default class GlobalDAO<T extends Document> {
    /**
     * The Mongoose model to operate on.
     */
    protected model: Model<T>;
    
    /**
     * Create a new GlobalDAO.
     * @param model - The Mongoose model to operate on.
     */
    constructor(model: Model<T>) {
        this.model = model;
    }
    
    /**
     * Create and persist a new document.
     * @param data - The data used to create the document.
     * @returns The created document.
     * @throws If validation or database errors occur.
     */
    async create(data: Partial<T>): Promise<T> {
        try {
            const document = new this.model(data);
            return await document.save() as T;
        } catch (error: any) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    }
    
    /**
     * Find a document by its ID.
     * @param id - The document's unique identifier.
     * @returns The found document.
     * @throws If not found or database errors occur.
     */
    async read(id: string): Promise<T> {
        try {
            const document = await this.model.findById(id) as T | null;
            if (!document) throw new Error("Document not found");
            return document;
        } catch (error: any) {
            throw new Error(`Error getting document by ID: ${error.message}`);
        }
    }

    /**
     * Update a document by ID.
     * @param id - The document's unique identifier.
     * @param updateData - The data to update the document with.
     * @returns The updated document.
     * @throws If not found or validation errors occur.
     */
    async update(id: string, updateData: Partial<T>): Promise<T> {
        try {
            const updatedDocument = await this.model.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ) as T | null;
            
            if (!updatedDocument) throw new Error("Document not found");
            return updatedDocument;
        } catch (error: any) {
            throw new Error(`Error updating document by ID: ${error.message}`);
        }
    }

    /**
     * Delete a document by ID.
     * @param id - The document's unique identifier.
     * @returns The deleted document.
     * @throws If not found or database errors occur.
     */
    async delete(id: string): Promise<T> {
        try {
            const deletedDocument = await this.model.findByIdAndDelete(id) as T | null;
            if (!deletedDocument) throw new Error("Document not found");
            return deletedDocument;
        } catch (error: any) {
            throw new Error(`Error deleting document by ID: ${error.message}`);
        }
    }

    /**
     * Retrieve all documents matching the given filter.
     * @param filter - Optional MongoDB filter object.
     * @returns An array of matching documents.
     * @throws If database errors occur.
     */
    async getAll(filter: FilterQuery<T> = {}): Promise<T[]> {
        try {
            return await this.model.find(filter) as T[];
        } catch (error: any) {
            throw new Error(`Error getting documents: ${error.message}`);
        }
    }
}