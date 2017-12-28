import os
import tornado.ioloop
import tornado.web

settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
}

class MainHandler(tornado.web.RequestHandler):

    def get(self):
        return self.render("templates/index.html")


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
    ], **settings)

if __name__ == "__main__":
    app = make_app()
    app.listen(3000)
    tornado.ioloop.IOLoop.current().start()
