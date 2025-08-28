class StudentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'student_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "first_name_c" }},
          { field: { Name: "last_name_c" }},
          { field: { Name: "email_c" }},
          { field: { Name: "grade_c" }},
          { field: { Name: "date_of_birth_c" }},
          { field: { Name: "parent_contact_c" }},
          { field: { Name: "notes_c" }},
          { field: { Name: "status_c" }}
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching students:", error?.response?.data?.message);
      } else {
        console.error("Error fetching students:", error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "first_name_c" }},
          { field: { Name: "last_name_c" }},
          { field: { Name: "email_c" }},
          { field: { Name: "grade_c" }},
          { field: { Name: "date_of_birth_c" }},
          { field: { Name: "parent_contact_c" }},
          { field: { Name: "notes_c" }},
          { field: { Name: "status_c" }}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching student with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching student with ID ${id}:`, error);
      }
      return null;
    }
  }

  async create(studentData) {
    try {
      const params = {
        records: [{
          Name: `${studentData.first_name_c} ${studentData.last_name_c}`,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          grade_c: studentData.grade_c,
          date_of_birth_c: studentData.date_of_birth_c,
          parent_contact_c: studentData.parent_contact_c,
          notes_c: studentData.notes_c,
          status_c: studentData.status_c
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create student ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create student");
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating student:", error);
        throw error;
      }
    }
  }

  async update(id, studentData) {
    try {
      const updateData = {
        Id: parseInt(id),
        first_name_c: studentData.first_name_c,
        last_name_c: studentData.last_name_c,
        email_c: studentData.email_c,
        grade_c: studentData.grade_c,
        date_of_birth_c: studentData.date_of_birth_c,
        parent_contact_c: studentData.parent_contact_c,
        notes_c: studentData.notes_c,
        status_c: studentData.status_c
      };
      
      if (studentData.first_name_c && studentData.last_name_c) {
        updateData.Name = `${studentData.first_name_c} ${studentData.last_name_c}`;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update student ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update student");
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating student:", error);
        throw error;
      }
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete student ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete student");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting student:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting student:", error);
        throw error;
      }
    }
  }
}

export default new StudentService();