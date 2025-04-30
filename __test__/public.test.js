const {
  describe,
  test,
  beforeAll,
  afterAll,
  expect,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { Product, User, Category } = require("../models");
const { hashPassword } = require("../helpers/bcrypt");
const e = require("express");
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

describe("GET /pub/products", () => {
  test("Berhasil mendapatkan Entitas Utama tanpa menggunakan query filter parameter", async () => {
    const response = await request(app).get("/pub/products");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentPage", 1);
    expect(response.body).toHaveProperty("totalPages", 2);
    expect(response.body).toHaveProperty("totalProducts", 16);
    expect(response.body).toHaveProperty("products", expect.any(Array));
  });

  test("Berhasil mendapatkan Entitas Utama dengan 1 query filter parameter", async () => {
    const response = await request(app).get("/pub/products?filter=1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentPage", 1);
    expect(response.body).toHaveProperty("totalPages", 1);
    expect(response.body).toHaveProperty("totalProducts", 2);
    expect(response.body).toHaveProperty("products", expect.any(Array));
  });

  test("Berhasil mendapatkan Entitas Utama jumlah data yang sesuai ketika memberikan page tertentu (cek pagination-nya)", async () => {
    const response = await request(app).get("/pub/products?limit=5&page=3");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentPage", 3);
    expect(response.body).toHaveProperty("totalPages", 4);
    expect(response.body).toHaveProperty("totalProducts", 16);
    expect(response.body).toHaveProperty("products", expect.any(Array));
  });
});

describe("GET /pub/products/:id", () => {
  test("Berhasil mendapatkan 1 Entitas Utama sesuai dengan params id yang diberikan", async () => {
    const response = await request(app).get("/pub/products/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
  });

  test("Gagal mendapatkan Entitas Utama karena params id yang diberikan tidak ada di database / invalid", async () => {
    const response = await request(app).get("/pub/products/100");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });
});
