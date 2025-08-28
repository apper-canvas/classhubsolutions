class GradeService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'grade_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "score_c" }},
          { field: { Name: "submitted_date_c" }},
          { field: { Name: "comments_c" }},
          { 
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" }}
          },
          { 
            field: { Name: "assignment_id_c" },
            referenceField: { field: { Name: "Name" }}
          }
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
        console.error("Error fetching grades:", error?.response?.data?.message);
      } else {
        console.error("Error fetching grades:", error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "score_c" }},
          { field: { Name: "submitted_date_c" }},
          { field: { Name: "comments_c" }},
          { 
            field: { Name: "student_id_c" },
            referenceField: { field: { Name: "Name" }}
          },
          { 
            field: { Name: "assignment_id_c" },
            referenceField: { field: { Name: "Name" }}
          }
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
        console.error(`Error fetching grade with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching grade with ID ${id}:`, error);
      }
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "score_c" }},
          { field: { Name: "submitted_date_c" }},
          { field: { Name: "comments_c" }},
          { field: { Name: "student_id_c" }},
          { field: { Name: "assignment_id_c" }}
        ],
        where: [
          {
            FieldName: "student_id_c",
            Operator: "EqualTo",
            Values: [parseInt(studentId)],
            Include: true
          }
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
        console.error(`Error fetching grades for student ${studentId}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching grades for student ${studentId}:`, error);
      }
      return [];
    }
  }

  async create(gradeData) {
    try {
      const params = {
        records: [{
          Name: `Grade for ${gradeData.student_id_c}`,
          score_c: parseInt(gradeData.score_c),
          submitted_date_c: gradeData.submitted_date_c || new Date().toISOString(),
          comments_c: gradeData.comments_c,
          student_id_c: parseInt(gradeData.student_id_c),
          assignment_id_c: parseInt(gradeData.assignment_id_c)
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
          console.error(`Failed to create grade ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create grade");
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating grade:", error);
        throw error;
      }
    }
  }

  async update(id, gradeData) {
    try {
      const updateData = {
        Id: parseInt(id),
        score_c: parseInt(gradeData.score_c),
        submitted_date_c: gradeData.submitted_date_c,
        comments_c: gradeData.comments_c
      };
      
      if (gradeData.student_id_c) {
        updateData.student_id_c = parseInt(gradeData.student_id_c);
      }
      
      if (gradeData.assignment_id_c) {
        updateData.assignment_id_c = parseInt(gradeData.assignment_id_c);
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
          console.error(`Failed to update grade ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update grade");
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating grade:", error);
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
          console.error(`Failed to delete grade ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete grade");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting grade:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting grade:", error);
        throw error;
      }
}
  }
}

export default new GradeService();