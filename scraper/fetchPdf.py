from requests import Response
from requests_html import HTMLSession
from json import dumps
import sys

from constants import MIRRORS, STATUS_CODE_OK

def fetchFileViaMirrors(session: HTMLSession, encoded_link: str):
    for mirror in MIRRORS:
        final_link = mirror + encoded_link
        r: Response = session.get(final_link)
        if r.status_code == STATUS_CODE_OK:
            print(dumps({ "link": final_link }))
            break


if __name__ == "__main__":
    if len(sys.argv) > 1:
        encoded_link = sys.argv[1]
        s: HTMLSession = HTMLSession()
        fetchFileViaMirrors(s, encoded_link)