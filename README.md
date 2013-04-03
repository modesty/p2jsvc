p2jsvc
======

A RESTful web service adaptor for [pdf2json](https://github.com/modesty/pdf2json), built with restify and nodejs.

Installation
===

                git clone https://github.com/modesty/p2jsvc
                cd p2jsvc
                npm install

Start the Server
===
                cd p2jsvc
                node index

You should see '[time_stamp] - PDFFORMServer1 listening at http://0.0.0.0:8001' in termial window.

Service Status Check
===
                curl -isv http://0.0.0.0:8001/pdfform/status

Response should include something like this:

                {"status":{"code":200,"message":"OK","fieldName":"PDFFORMServer1"}}


Test with GET
===
                curl -isv http://0.0.0.0:8001/pdfform/data/xfa_1040ez
                curl -isv http://0.0.0.0:8001/pdfform/data/xfa_1040a
                curl -isv http://0.0.0.0:8001/pdfform/data/xfa_1040

Test with POST
===
                curl -isv -H "Content-Type: application/json" -X POST -d '{"folderName":"data", "pdfId":"xfa_1040ez"}' http://0.0.0.0:8001/pdfform
                curl -isv -H "Content-Type: application/json" -X POST -d '{"folderName":"data", "pdfId":"xfa_1040a"}' http://0.0.0.0:8001/pdfform
                curl -isv -H "Content-Type: application/json" -X POST -d '{"folderName":"data", "pdfId":"xfa_1040"}' http://0.0.0.0:8001/pdfform
