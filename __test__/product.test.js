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
const { signToken } = require("../helpers/jwt");
const { queryInterface } = require("../models/index").sequelize;

let access_token_admin;
let access_token_user1;
let access_token_user2;

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

  const admin = await User.findOne({ where: { email: "admin@mail.com" } });
  access_token_admin = signToken({ id: admin.id });

  const user1 = await User.findOne({ where: { email: "a@mail.com" } });
  access_token_user1 = signToken({ id: user1.id });

  const user2 = await User.findOne({ where: { email: "b@mail.com" } });
  access_token_user2 = signToken({ id: user2.id });
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

describe("POST /products", () => {
  test("Berhasil membuat entitas utama", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${access_token_user1}`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 10,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id", 17);
    expect(response.body).toHaveProperty("name", "HEMMABAK");
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", 54900);
    expect(response.body).toHaveProperty("stock", 10);
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("categoryId", 5);
    expect(response.body).toHaveProperty("authorId", 2);
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).post("/products").send({
      name: "HEMMABAK",
      description:
        "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
      price: 54900,
      stock: 10,
      imgUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
      categoryId: 5,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer 123`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 10,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  test("Gagal ketika request body tidak sesuai (validation required)", async () => {
    const response = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 10,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Category is required");
  });
});

describe("PUT /products/:id", () => {
  test("Berhasil mengupdate data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .put("/products/17")
      .set("Authorization", `Bearer ${access_token_user1}`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 21,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 17);
    expect(response.body).toHaveProperty("name", "HEMMABAK");
    expect(response.body).toHaveProperty("description", expect.any(String));
    expect(response.body).toHaveProperty("price", 54900);
    expect(response.body).toHaveProperty("stock", 21);
    expect(response.body).toHaveProperty("imgUrl", expect.any(String));
    expect(response.body).toHaveProperty("categoryId", 5);
    expect(response.body).toHaveProperty("authorId", 2);
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).put("/products/17").send({
      name: "HEMMABAK",
      description:
        "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
      price: 54900,
      stock: 21,
      imgUrl:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
      categoryId: 5,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .put("/products/17")
      .set("Authorization", `Bearer 123`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 21,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  test("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const response = await request(app)
      .put("/products/100")
      .set("Authorization", `Bearer ${access_token_user1}`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 21,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Product with id:100 not found"
    );
  });

  test("Gagal menjalankan fitur ketika Staff mengolah data entity yang bukan miliknya", async () => {
    const response = await request(app)
      .put("/products/17")
      .set("Authorization", `Bearer ${access_token_user2}`)
      .send({
        name: "HEMMABAK",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 21,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  test("Gagal ketika request body yang diberikan tidak sesuai", async () => {
    const response = await request(app)
      .put("/products/17")
      .set("Authorization", `Bearer ${access_token_user1}`)
      .send({
        name: "",
        description:
          "Make sure your next baking session is fun and hassle-free. This springform is a versatile kitchen assistant that helps you succeed with everything from cheesecake and quiche to deep-pan pizza",
        price: 54900,
        stock: 21,
        imgUrl:
          "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/409/0840944_PE778711_S4.webp",
        categoryId: 5,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Name of product is required"
    );
  });
});

describe("DELETE /products/:id", () => {
  test("Berhasil menghapus data Entitas Utama berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .delete("/products/17")
      .set("Authorization", `Bearer ${access_token_user1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "HEMMABAK deleted successfully"
    );
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).delete("/products/17");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .delete("/products/17")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  test("Gagal karena id entity yang dikirim tidak terdapat di database", async () => {
    const response = await request(app)
      .delete("/products/100")
      .set("Authorization", `Bearer ${access_token_user1}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty(
      "message",
      "Product with id:100 not found"
    );
  });

  test("Gagal menjalankan fitur ketika Staff menghapus entity yang bukan miliknya", async () => {
    const response = await request(app)
      .delete("/products/16")
      .set("Authorization", `Bearer ${access_token_user2}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
});
