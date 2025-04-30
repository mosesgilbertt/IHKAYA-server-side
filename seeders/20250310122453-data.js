"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", [
      {
        email: "admin@mail.com",
        password: hashPassword("12345"),
        role: "Admin",
        phoneNumber: "081234567890",
        address: "Jl. Admin No. 1",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "a@mail.com",
        password: hashPassword("12345"),
        role: "Staff",
        phoneNumber: "081234567890",
        address: "Jl. Angklung No. 7",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: "b@mail.com",
        password: hashPassword("12345"),
        role: "Staff",
        phoneNumber: "081234567890",
        address: "Jl. Bayam No. 8a",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert(
      "Categories",
      require("../data/category.json").map((el) => {
        return {
          ...el,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    await queryInterface.bulkInsert(
      "Products",
      require("../data/product.json").map((el) => {
        return {
          ...el,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Products", null, {});

    await queryInterface.bulkDelete("Categories", null, {});

    await queryInterface.bulkDelete("Users", null, {});
  },
};
