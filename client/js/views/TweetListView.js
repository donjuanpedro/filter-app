const Backbone = require('backbone');
const TweetItemView = require('./TweetItemView');
const TweetModel = require('../models/TweetModel');

const TweetListView = Backbone.View.extend({
  el: `
    <div>
      <form id="filterPost" action="/tweets" method="POST">
        <div>
          <label for="name">New Filter</label>
          <input type="text" name="body" />
          <input type="submit" value="Post" />
        </div>
      </form>
      <ul id="tweetlist"></ul>
    </div>
  `,

  initialize() {
    this.listenTo(this.collection, 'update', this.render);
  },

  events: {
    'submit form': 'handleFormSubmit'
  },

  handleFormSubmit(e) {
    const form = $(e.target);
    const tweet = new TweetModel({
      body: form.find('input[name="body"]').val(),
      user: $('[data-bootstrap]').data('bootstrap').userId
    });

      tweet.save(null, {
        success: () => {
          this.collection.add(tweet);
          form.find('input[type="text"]').val('');
          this.render();
        }
    });
    e.preventDefault();
  },

  render() {
    this.$('#tweetlist').html('');
    this.collection.each((tweet) => {
      const tweetView = new TweetItemView({ model: tweet });
      this.$('#tweetlist').append(tweetView.render().el);
    });
    return this;
  }
});

module.exports = TweetListView;
