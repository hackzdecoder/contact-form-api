const { ContactPerson } = require('../models');

const DashboardController = {
    // Welcome message
    index: async (_request, response) => {
        return response.status(200).json({ data: "Welcome User" });
    },

    // CREATE
    createContact: async (request, response) => {
        try {
            const { fullname, contact_no } = request.body;

            // Validate contact number: must be 7 to 15 digits only
            const phoneRegex = /^[0-9]{7,15}$/;
            if (!phoneRegex.test(contact_no)) {
                return response.status(400).json({ message: "Contact number must be 7–15 digits only" });
            }

            const contact = await ContactPerson.create({ fullname, contact_no });
            return response.status(201).json({ message: "Contact created", contact });
        } catch (error) {
            console.error("Create Error:", error);
            return response.status(500).json({ message: "Server error" });
        }
    },

    // READ ALL
    getAllContacts: async (request, response) => {
        try {
            const contacts = await ContactPerson.findAll({
                order: [['createdAt', 'DESC']]
            });
            return response.status(200).json(contacts);
        } catch (error) {
            console.error("Read All Error:", error);
            return response.status(500).json({ message: "Server error" });
        }
    },

    // READ ONE BY ID
    getContactById: async (request, response) => {
        try {
            const contact = await ContactPerson.findByPk(request.params.id);
            if (!contact) return response.status(404).json({ message: "Contact not found" });
            return response.status(200).json(contact);
        } catch (error) {
            console.error("Read One Error:", error);
            return response.status(500).json({ message: "Server error" });
        }
    },

    // UPDATE
    updateContact: async (request, response) => {
        try {
            const { fullname, contact_no } = request.body;
            const contact = await ContactPerson.findByPk(request.params.id);
            if (!contact) return response.status(404).json({ message: "Contact not found" });

            // Validate contact number if provided
            if (contact_no && !/^[0-9]{7,15}$/.test(contact_no)) {
                return response.status(400).json({ message: "Contact number must be 7–15 digits only" });
            }

            contact.fullname = fullname || contact.fullname;
            contact.contact_no = contact_no || contact.contact_no;
            await contact.save();

            return response.status(200).json({ message: "Contact updated", contact });
        } catch (error) {
            console.error("Update Error:", error);
            return response.status(500).json({ message: "Server error" });
        }
    },

    // DELETE
    deleteContact: async (request, response) => {
        try {
            const contact = await ContactPerson.findByPk(request.params.id);
            if (!contact) return response.status(404).json({ message: "Contact not found" });

            await contact.destroy();
            return response.status(200).json({ message: "Contact deleted" });
        } catch (error) {
            console.error("Delete Error:", error);
            return response.status(500).json({ message: "Server error" });
        }
    },
};

module.exports = DashboardController;
