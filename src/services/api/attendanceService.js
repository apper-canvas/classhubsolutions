class AttendanceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'attendance_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date_c" }},
          { field: { Name: "status_c" }},
          { field: { Name: "notes_c" }},
          { 
            field: { Name: "student_id_c" },
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
        console.error("Error fetching attendance:", error?.response?.data?.message);
      } else {
        console.error("Error fetching attendance:", error);
      }
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date_c" }},
          { field: { Name: "status_c" }},
          { field: { Name: "notes_c" }},
          { 
            field: { Name: "student_id_c" },
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
        console.error(`Error fetching attendance with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching attendance with ID ${id}:`, error);
      }
      return null;
    }
  }

  async getByStudentId(studentId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date_c" }},
          { field: { Name: "status_c" }},
          { field: { Name: "notes_c" }},
          { field: { Name: "student_id_c" }}
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
        console.error(`Error fetching attendance for student ${studentId}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching attendance for student ${studentId}:`, error);
      }
      return [];
    }
  }

  async getByDate(date) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" }},
          { field: { Name: "date_c" }},
          { field: { Name: "status_c" }},
          { field: { Name: "notes_c" }},
          { field: { Name: "student_id_c" }}
        ],
        where: [
          {
            FieldName: "date_c",
            Operator: "EqualTo",
            Values: [new Date(date).toISOString().split('T')[0]],
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
        console.error(`Error fetching attendance for date ${date}:`, error?.response?.data?.message);
      } else {
        console.error(`Error fetching attendance for date ${date}:`, error);
      }
      return [];
    }
  }

  async create(attendanceData) {
    try {
      const params = {
        records: [{
          Name: `Attendance for ${attendanceData.student_id_c}`,
          date_c: attendanceData.date_c || new Date().toISOString().split('T')[0],
          status_c: attendanceData.status_c,
          notes_c: attendanceData.notes_c,
          student_id_c: parseInt(attendanceData.student_id_c)
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
          console.error(`Failed to create attendance ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create attendance record");
        }
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating attendance:", error);
        throw error;
      }
    }
  }

  async update(id, attendanceData) {
    try {
      const updateData = {
        Id: parseInt(id),
        date_c: attendanceData.date_c,
        status_c: attendanceData.status_c,
        notes_c: attendanceData.notes_c
      };
      
      if (attendanceData.student_id_c) {
        updateData.student_id_c = parseInt(attendanceData.student_id_c);
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
          console.error(`Failed to update attendance ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update attendance record");
        }
        
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating attendance:", error);
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
          console.error(`Failed to delete attendance ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete attendance record");
        }
        
        return successfulDeletions.length > 0;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting attendance:", error?.response?.data?.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting attendance:", error);
        throw error;
      }
    }
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export default new AttendanceService();