----
title: Backbone.Collection
date:   2013-05-15
----

Backbone classes that are used to render views and manage events for a
collection of models are common. They all render model
views, listen to a collection for events, and have assorted methods to manage
model views. These classes tend to be one of the largest sources of non-[DRY](http://en.wikipedia.org/wiki/Don't_repeat_yourself) code
in Backbone apps. Thats why having a solid base class for these views like
Backbone.CollectionView is indispensable.

[Backbone.CollectionView](http://rotundasoftware.github.io/backbone.collectionView/)
extends Backbone's view class, it adds default functionality and options that make
it much easier to create awesome user experiences while keeping your code DRY. I'll go
over some of its features and compare some code using Backbone.CollectionView
to the equivalent implementation in vanilla Backbone. Check out the [demo page](http://rotundasoftware.github.io/backbone.collectionView/)
for examples along with the code used to implement them.

## Features
### Automatic model view rendering

When initialized, a view that inherits from Backbone.CollectionView will automatically render a view for
each model in the provided collection. It will also start listening
to its collection to ensure that the model views are re-rendered correctly when the
collection changes.

### Selectable

Backbone.CollectionView provides
a very nice way to create a list of selectable items through its `selectable` option. The default
behavior is to have models be selected when their corresponding view is clicked.
By default, only one model is selectable at a time, if you want to give users
the ability to select multiple models there is the `selectMultiple` option.

Along with making it easy to provide a user interface for selecting models,
Backbone.CollectionView exposes an intuitive API for managing model selection.
Whenever the selection is changed the view fires a `selectionChanged` event
that passes the new and old models to the handler. The view has necessary methods like
`getSelectedModels` and `setSelectedModel` which are self explanatory. You
can `get` and `set` by the `data-id`, `cid`, `offset` (index of model view in all
visible model views), and by the `view` that the model is attached to.

### Sortable

Backbone.CollectionView also provides a `sortable` option which uses jQuery
UI's [sortable interaction](http://jqueryui.com/sortable/) to enable drag and
drop sorting on your model views, if you haven't checked it out I highly
recommend doing so. It provides a powerful API for managing drag and drop sorting
(something that requires a ton of code to implement by hand) and is reliable as
anything you would expect to come out of the jQuery project. It's great to be able
to utilize this interaction seamlessly though Backbone.CollectionView.

## Comparison
It is often the case that you need a class that manages the rendering of a view
for each model in its collection. The examples below are of classes that provide this
functionality, the first inherits from the Backbone base view class
and the second inherits from the Backbone.CollectionView class. I also added
functionality to add a model (and its corresponding view) to the collection to
show that the class that inherits from Backbone.CollectionView listens to its collection and handles the
re-rendering for you.

### Inheriting from Backbone.View
```javascript
var TodosView = Backbone.View.extend({
  el: $('#todo-container'),

  events: {
    'click #create-todo': 'createTodo'
  },

  initialize: function () {
    collection: new TodosCollection(),
    this.listenTo(this.collection, 'add', this.addOne);
    this.render();
  },

  render: function () {
    this.addAll();
  },

  addAll: function () {
    $('#todo-list').html('');
    this.collection.each(this.addOne, this);
  },

  addOne: function (todo) {
    var view = new TodoView({model: todo});
    $('#todo-list').append(view.render().el);
  },

  createTodo: function () {
    this.collection.add({name: 'newTodo'});
  }
});
```

### Inheriting from Backbone.CollectionView
```javascript
 var TodosView = Backbone.CollectionView({
  el: $('#todo-container'),
  collection: new TodosCollection(),
  modelView: TodoView,

  events: {
    'click #create-todo': 'createTodo'
  },

  createTodo: function () {
    this.collection.add({name: 'newTodo'});
  }
});
```

