#! /usr/bin/env python
# -*- coding: utf-8 -*-
import os
import re
import sys
import json
import argparse
from logging import (
    getLogger,
    INFO,
    )
from tornado.ioloop import IOLoop
from tornado.web import (
    Application,
    RequestHandler,
    StaticFileHandler,
    )


_logger = getLogger(__name__)
_logger.setLevel(INFO)

class TopHandler(RequestHandler):
    def get(self):
        self.write("Hello, world")


class PingPongHandler(RequestHandler):
    def get(self):
        self.write("PONG (GET)")

    def post(self):
        self.write("PONG (POST)")


class UserHandler(RequestHandler):
    def get(self):
        regxes = []
        try:
            patterns = self.request.query_arguments['pattern']
            patterns = map(lambda s: s.decode(), patterns)
            regxes = map(re.compile, patterns)
        except ValueError:
            raise
        except UnicodeDecodeError:
            raise
        db = os.path.join(os.path.dirname(__file__), 'api/users.json')
        with open(db, 'rt') as fp:
            data = json.load(fp)
            users = [user for user in data if any(regx.search(user['name']) for regx in regxes)]
        self.write(json.dumps(users))

    def post(self):
        try:
            data = self.request.body.decode()
            users = json.loads(data)
        except UnicodeDecodeError:  # encoding error
            raise
        except ValueError:  # invalid json
            raise

        res = {
            'success': [],
            'error': [],
        }
        for ii, user in enumerate(users):
            if ii % 2 == 0:
                res['success'].append(user)
            else:
                res['error'].append(user)
        self.write(json.dumps(res))


def main(argv=sys.argv[1:]):
    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', type=int, default=8000)
    args = parser.parse_args(argv)

    port = args.port

    settings = {
        'static_path': './',
        'cookie_secret': '__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__',
        'login_url': '/login',
        'xsrf_cookies': False,
        }
    routes = [
        (r'/ping', PingPongHandler),
        (r'/api/user', UserHandler),
        (r'/(.*)', StaticFileHandler, {'path': './'}),
        ]
    _logger.info('application starting...')
    print('application starting...')
    app = Application(routes, **settings)
    app.listen(port)
    IOLoop.current().start()
    _logger.info('application started!!')
    print('application started')

if __name__ == "__main__":
    main()
