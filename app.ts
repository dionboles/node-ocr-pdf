const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const Tesseract = require ('tesseract.js')
const cors = require("cors")
app.use(cors())
const storge = multer.diskStorage({
  destination: (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) => {
    cb(null, './uploads');
  },
  filename: function (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: any) => void
  ) {
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1
    );
    console.log(ext);

    cb(null, file.originalname);
  },
});

const check = () => {
  try {
    return fs.statSync('./uploads').isDirectory().valueOf();
  } catch (error) {
    return false;
  }
};
console.log(check());
if (check() === false) {
  fs.mkdirSync('uploads', () => {
    console.log('making');
  });
}

const upload = multer({
  storage: storge,
}).single('avatar');

app.set('view engine', 'ejs');

app.get('/', (req: any, res: { render: (arg0: string) => void }) => {
  res.render('index');
});
app.post(
  '/upload',
  (
    req: { file: { originalname: any } },
    res: {
      status: (
        arg0: number
      ) => { (): any; new (): any; end: { (): void; new (): any } };
      send: (arg0: any) => void;
    }
  ) => {
    upload(req, res, (err: any) => {
      if (err) {
        console.error(err);
        res.status(204).end();
      }
      fs.readFile(
        `./uploads/${req.file.originalname}`,
        async (err: Error, data:Buffer) => {
          if (err){
            return console.log(err.message);
          }
          let data_tess = Tesseract.recognize(data, 'eng', { tessjs_create_pdf: '1' })
            .then((result) => {
              res.send(result.data.text);
              return result
            })
            // fs.writeFileSync('tesseract-ocr-result.pdf',  Buffer.from(data_tess.hocr))
        }
      );
    });
  }
);
app.get('/donwload', (req: any, res: { download: (arg0: string) => void }) => {
  const file = `${__dirname}/tesseract.js-ocr-result.pdf`;
  res.download(file);
});

const PORT = 8100 || process.env.PORT;
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
