const resolvers = {
    Mutation: {
      addSelection: async (_, { betAmount, totalPlayerRounds, currency }) => {
        try {
          // Simulating database save or business logic
          console.log("Saving selection:", { betAmount, totalPlayerRounds, currency });
  
          // Perform your backend logic (e.g., save to DB)
          // Example: Database.save(payload)
  
          return {
            success: true,
            message: "Selection added successfully!",
          };
        } catch (error) {
          return {
            success: false,
            message: `Failed to add selection: ${error.message}`,
          };
        }
      },
    },
  };
  
  module.exports = resolvers;
  