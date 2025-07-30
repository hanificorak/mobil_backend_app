"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var db = require("../../db");

var md5 = require("md5");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var nodemailer = require("nodemailer");

var fs = require("fs");

var path = require("path");

exports.login = function _callee(req, res) {
  var email, password, _ref, _ref2, rows, user, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          email = req.body.email;
          password = req.body.password;

          if (!(email == null)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.json({
            status: false,
            error: "E-Mail adresi alınamadı"
          }));

        case 5:
          if (!(password == null)) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.json({
            status: false,
            error: "Şifre alınamadı"
          }));

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(db.execute("SELECT * FROM users WHERE email = ?", [email]));

        case 9:
          _ref = _context.sent;
          _ref2 = _slicedToArray(_ref, 1);
          rows = _ref2[0];

          if (!(rows.length === 0)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.json({
            status: false,
            error: "Kullanıcı bulunamadı"
          }));

        case 14:
          user = rows[0];

          if (bcrypt.compareSync(password, user.password)) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.json({
            status: false,
            error: "Şifre yanlış."
          }));

        case 17:
          token = jwt.sign({
            id: user.id,
            email: user.email
          }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
          });
          res.json({
            status: true,
            user: user,
            token: token
          });
          _context.next = 24;
          break;

        case 21:
          _context.prev = 21;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            status: false,
            error: _context.t0.message
          });

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 21]]);
};

exports.register = function _callee2(req, res) {
  var _req$body, name, email, city, password, password_rep, _ref3, _ref4, existing, hashedPassword, transporter;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, name = _req$body.name, email = _req$body.email, city = _req$body.city, password = _req$body.password, password_rep = _req$body.password_rep;

          if (name) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "Ad soyad alınamadı."
          }));

        case 4:
          if (email) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "E-Mail alınamadı."
          }));

        case 6:
          if (city) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "Şehir alınamadı."
          }));

        case 8:
          if (password) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "Şifre alınamadı."
          }));

        case 10:
          if (password_rep) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "Şifre tekrar alınamadı."
          }));

        case 12:
          if (!(password !== password_rep)) {
            _context2.next = 14;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "Girilen şifreler uyumsuz."
          }));

        case 14:
          _context2.next = 16;
          return regeneratorRuntime.awrap(db.query("SELECT id FROM users WHERE email = ?", [email]));

        case 16:
          _ref3 = _context2.sent;
          _ref4 = _slicedToArray(_ref3, 1);
          existing = _ref4[0];

          if (!(existing.length > 0)) {
            _context2.next = 21;
            break;
          }

          return _context2.abrupt("return", res.json({
            status: false,
            message: "Bu e-posta adresi zaten kayıtlı."
          }));

        case 21:
          _context2.next = 23;
          return regeneratorRuntime.awrap(bcrypt.hash(password, 10));

        case 23:
          hashedPassword = _context2.sent;
          _context2.next = 26;
          return regeneratorRuntime.awrap(db.query("INSERT INTO users (name, email, city, password, created_at) VALUES (?, ?, ?, ?, NOW())", [name, email, city, hashedPassword]));

        case 26:
          transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              // Gmail adresin
              pass: process.env.EMAIL_PASS // Gmail şifren veya uygulama şifresi

            }
          });
          return _context2.abrupt("return", res.json({
            status: true,
            message: "Kayıt başarılı."
          }));

        case 30:
          _context2.prev = 30;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);
          res.json({
            status: false,
            message: _context2.t0.message
          });

        case 34:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 30]]);
};