const {
  describe,
  test,
  beforeAll,
  afterAll,
  expect,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Category, Product } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = require("../models/index").sequelize;

beforeAll(async () => {
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
});

afterAll(async () => {
  await Product.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Category.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /login", () => {
  test("Berhasil login dan mengirimkan access_token", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "12345",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  test("Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Password tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@mail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Email diberikan invalid / tidak terdaftar", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("Password diberikan salah / tidak match", async () => {
    const response = await request(app).post("/login").send({
      email: "admin@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});
