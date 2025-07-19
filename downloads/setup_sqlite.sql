/****************************************************************/
/*                                                              */
/*           実践的SQL学習サイト 演習用データセット             */
/*                      (SQLite版)                              */
/*                                                              */
/****************************************************************/

-- テーブルが存在すれば削除する (再実行できるようにするため)
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS quarterly_sales;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

/****************************************************************/
/*  1. departments (部署マスタ)                                  */
/****************************************************************/
CREATE TABLE departments (
    department_id   INTEGER PRIMARY KEY,
    department_name TEXT NOT NULL UNIQUE
);

INSERT INTO departments (department_id, department_name) VALUES
(10, '営業部'),
(20, '開発部'),
(30, '人事部'),
(40, '総務部'); -- この部署は従業員が所属していない

/****************************************************************/
/*  2. employees (従業員マスタ)                                  */
/****************************************************************/
CREATE TABLE employees (
    employee_id     INTEGER PRIMARY KEY,
    employee_name   TEXT NOT NULL,
    hire_date       TEXT, -- YYYY-MM-DD
    salary          INTEGER,
    department_id   INTEGER,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

INSERT INTO employees (employee_id, employee_name, hire_date, salary, department_id) VALUES
(1, '山田 太郎', '2018-04-01', 300000, 10),
(2, '鈴木 花子', '2019-04-01', 320000, 20),
(3, '佐藤 次郎', '2020-04-01', 280000, 10),
(4, '田中 三郎', '2020-10-15', 350000, 20),
(5, '渡辺 久美', '2017-08-01', 380000, 30),
(6, '高橋 四郎', '2021-04-01', 260000, NULL); -- この従業員は部署に所属していない

/****************************************************************/
/*  3. products (商品マスタ)                                     */
/****************************************************************/
CREATE TABLE products (
    product_id      INTEGER PRIMARY KEY,
    product_name    TEXT NOT NULL,
    category        TEXT,
    price           INTEGER NOT NULL
);

INSERT INTO products (product_id, product_name, category, price) VALUES
(101, 'ノートPC A', 'PC', 120000),
(102, 'ノートPC B', 'PC', 150000),
(201, 'モニター 24インチ', '周辺機器', 30000),
(202, 'キーボード', '周辺機器', 8000),
(301, 'ソフトウェア X', 'ソフトウェア', 50000);

/****************************************************************/
/*  4. customers (顧客マスタ)                                    */
/****************************************************************/
CREATE TABLE customers (
    customer_id     INTEGER PRIMARY KEY,
    customer_name   TEXT NOT NULL,
    region          TEXT
);

INSERT INTO customers (customer_id, customer_name, region) VALUES
(1, '株式会社ABC', '関東'),
(2, '株式会社DEF', '関西'),
(3, 'GHI商事', '関東'),
(4, '株式会社JKL', '中部');

/****************************************************************/
/*  5. sales (売上トランザクション)                               */
/****************************************************************/
CREATE TABLE sales (
    sale_id         INTEGER PRIMARY KEY,
    sale_date       TEXT NOT NULL, -- YYYY-MM-DD
    customer_id     INTEGER,
    employee_id     INTEGER,
    product_id      INTEGER,
    quantity        INTEGER NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

INSERT INTO sales (sale_id, sale_date, customer_id, employee_id, product_id, quantity) VALUES
(1, '2023-04-10', 1, 1, 101, 2),
(2, '2023-04-12', 2, 3, 201, 5),
(3, '2023-04-15', 1, 1, 102, 1),
(4, '2023-05-02', 3, 2, 202, 10),
(5, '2023-05-10', 2, 3, 301, 1),
(6, '2023-05-21', 4, 1, 101, 1),
(7, '2023-06-05', 1, 2, 201, 3),
(8, '2023-06-11', 3, 1, 301, 1);

/****************************************************************/
/*  6. quarterly_sales (四半期売上 - 横持ちデータ)              */
/****************************************************************/
CREATE TABLE quarterly_sales (
    product_id      INTEGER,
    year            INTEGER,
    q1_sales        INTEGER,
    q2_sales        INTEGER,
    q3_sales        INTEGER,
    q4_sales        INTEGER,
    PRIMARY KEY (product_id, year)
);

INSERT INTO quarterly_sales (product_id, year, q1_sales, q2_sales, q3_sales, q4_sales) VALUES
(101, 2023, 1200000, 1350000, 1500000, 1800000),
(102, 2023, 800000, 900000, 850000, 950000),
(201, 2023, 500000, 520000, 600000, 650000);

/****************************************************************/
/*  7. audit_logs (監査ログ)                                     */
/****************************************************************/
CREATE TABLE audit_logs (
    log_id          INTEGER PRIMARY KEY AUTOINCREMENT,
    event_time      TEXT, -- ISO8601 format
    event_description TEXT
);
-- このテーブルはトリガーの演習で使用するため、初期データは空です。

/****************************************************************/
/*                     データ作成完了                             */
/****************************************************************/