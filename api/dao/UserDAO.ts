import User, { IUser } from '../models/User';
import GlobalDAO from './GlobalDAO';

/**
 * Data Access Object (DAO) for the User model.
 *
 * Extends the generic {@link GlobalDAO} class to provide
 * database operations (create, read, update, delete, getAll)
 * specifically for User documents.
 */
class UserDAO extends GlobalDAO<IUser> {
  /**
   * Create a new UserDAO instance.
   *
   * Passes the User Mongoose model to the parent class so that
   * all inherited CRUD methods operate on the User collection.
   */
  constructor() {
    super(User);
  }

  /**
   * Override update method to properly hash password when updated
   * @param id - The document's unique identifier.
   * @param updateData - The data to update the document with.
   * @returns The updated document.
   * @throws If not found or validation errors occur.
   */
  async update(id: string, updateData: Partial<IUser>): Promise<IUser> {
    try {

      if (updateData.password) {
        const user = await this.model.findById(id);
        if (!user) throw new Error("User not found");
        
        // If currentPassword is provided, verify it
        if ((updateData as any).currentPassword) {
          const isPasswordValid = await user.comparePassword((updateData as any).currentPassword);
          if (!isPasswordValid) {
            throw new Error("Current password is incorrect");
          }
          // Remove currentPassword from updateData so it's not saved
          delete (updateData as any).currentPassword;
        }

        Object.keys(updateData).forEach(key => {
          (user as any)[key] = (updateData as any)[key];
        });
        
        return await user.save() as IUser;
      }
      

      return await super.update(id, updateData);
      
    } catch (error: any) {
      throw new Error(`Error updating user by ID: ${error.message}`);
    }
  }
}

/**
 * Export a singleton instance of UserDAO.
 *
 * This ensures the same DAO instance is reused across the app,
 * avoiding redundant instantiations.
 */
export default new UserDAO();