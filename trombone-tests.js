/*
These tests require a local copy of the app to be set up, this app needs to be configured with sample credentials
Tests wihout assertions are used to trigger the behaviour and see if it works and can be manually asserted by
checking the console logs

we should fix this by mocking the local app...
*/

Tinytest.add('configure - valid local credentials', function (test) {
  Trombone.configure('kyC4MT6BgP3hSXPgo', 'fH33cQ71Mu20H3JspoinPWtHEAY1mOyciwt2biGAF0Q');
});

Tinytest.add('configure - incorrect app id', function (test) {
  Trombone.configure('kyC4MT6BgP3XXXXXX', 'fH33cQ71Mu20H3JspoinPWtHEAY1mOyciwt2biGAF0Q');
});

Tinytest.add('configure - incorrect app secret', function (test) {
  Trombone.configure('kyC4MT6BgP3hSXPgo', 'fHXXXXXXMu20H3JspoinPWtHEAY1mOyciwt2biGAF0Q');
});

Tinytest.add('configure - incorrect app secret & incorrect app id', function (test) {
  Trombone.configure('kyC4MT6BgP3XXXXXX', 'fHXXXXXXMu20H3JspoinPWtHEAY1mOyciwt2biGAF0Q');
});

Tinytest.add('configure - missing/invalid params', function (test) {
  test.equal(Trombone.configure().connected, false);
  test.equal(Trombone.configure('asdf').connected, false);
  test.equal(Trombone.configure('asdf', '').connected, false);
  test.equal(Trombone.configure('asdf', 'jlkjlkj').connected, false);
});
