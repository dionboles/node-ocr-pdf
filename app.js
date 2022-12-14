var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var express = require('express');
var app = express();
var fs = require('fs');
var multer = require('multer');
var Tesseract = require('tesseract.js');
var cors = require("cors");
app.use(cors());
var storge = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        var ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1);
        console.log(ext);
        cb(null, file.originalname);
    }
});
var check = function () {
    try {
        return fs.statSync('./uploads').isDirectory().valueOf();
    }
    catch (error) {
        return false;
    }
};
console.log(check());
if (check() === false) {
    fs.mkdirSync('uploads', function () {
        console.log('making');
    });
}
var upload = multer({
    storage: storge
}).single('avatar');
app.set('view engine', 'ejs');
app.get('/', function (req, res) {
    res.render('index');
});
app.post('/upload', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.error(err);
            res.status(204).end();
        }
        fs.readFile("./uploads/".concat(req.file.originalname), function (err, data) { return __awaiter(_this, void 0, void 0, function () {
            var data_tess;
            return __generator(this, function (_a) {
                if (err) {
                    return [2 /*return*/, console.log(err.message)];
                }
                data_tess = Tesseract.recognize(data, 'eng', { tessjs_create_pdf: '1' })
                    .then(function (result) {
                    res.send(result.data.text);
                    return result;
                });
                return [2 /*return*/];
            });
        }); });
    });
});
app.get('/donwload', function (req, res) {
    var file = "".concat(__dirname, "/tesseract.js-ocr-result.pdf");
    res.download(file);
});
var PORT = 8100 || process.env.PORT;
app.listen(PORT, function () { return console.log("http://localhost:".concat(PORT)); });
