/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;

const mongoose = require('mongoose');



module.exports = function (app) {
  mongoose.connect(process.env.MLAB_URI);
  
  var bookSchema = new mongoose.Schema({
			title:  { type: String, required: true },
			comments:  [String],
		});

	var Book = mongoose.model('Book', bookSchema);

  app.route('/api/books')
    .get(async function (req, res){
      try{
        let books = await Book.find();
        let response = books.map(book => (
          {title: book.title, _id: book._id, commentcount: book.comments.length}
        ));
        res.json(response);
      } catch(e){
        res.status(500).type("text").send("error fetching books");
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      try {
        let book = new Book({
          title: req.body.title,
          comments: []
        });
        await book.save();
        res.json(book);
      } catch(e) {
        res.status(401)
          .type('text')
          .send('Invalid input');
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      try {
        let book = await Book.findById(req.params.id);
        res.json(book);
      } catch(e){
        res.status(404).type("text").send("no book exists");
      }  
  })
    
    .post(async function(req, res){
      try{
        let book = await Book.findById(req.params.id); 
        book.comments.push(req.body.comment);
        let updatedBook = await book.save(); 
        res.json(updatedBook);
      }catch(e){
        res.status(404).type("text").send("comment could not be added");
      }
    })
    
    
    .delete(async function(req, res){ 
      try {
        await Book.findById(req.params.id).remove();
        res.type("text").send("delete successful");
      } catch(e){
          res.status(500).type("text").send("delete unsuccessful");
      }
      });
  
};
