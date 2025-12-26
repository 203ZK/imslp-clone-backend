import logging
from re import compile
from typing import List
from json import dumps
import sys

from requests import Response
from requests_html import Element, HTMLSession
from bs4 import BeautifulSoup, Tag

from constants import MIRRORS, STATUS_CODE_OK

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def getWorkPage(session: HTMLSession, link: str) -> Response:
    try:
        return session.get(link)
    except Exception as e:
        logging.error(f"Error getting page {link}: {e}")


def getTabsFromPage(response: Response) -> List[Element]:
    soup = BeautifulSoup(response.text, "html.parser")
    score_section = soup.find("div", {"id": "wpscore_tabs"})
    score_tabs = score_section.find_all("div", {"class": "jq-ui-tabs"})
    return score_tabs


def getScoreLinksFromTab(tab: Tag) -> List[str]:
    score_listings = tab.find_all("div", {"id": compile(r"^IMSLP")})

    scores = []
    for score_listing in score_listings:
        file_id = score_listing["id"]
        file_info = score_listing.find("span", {"class": "we_file_info2"})
        file_link = file_info.find("a", attrs={"href": compile(r"^/images")})
        scores.append({"imslp_key": file_id, "link": file_link["href"]})

    return scores


if __name__ == "__main__":
    if len(sys.argv) > 1:
        perm_link = sys.argv[1]

        s: HTMLSession = HTMLSession()
        resp: Response = getWorkPage(s, perm_link)
        tabs: List[Element] = getTabsFromPage(resp)
        scores: List[str] = getScoreLinksFromTab(tabs[0])

        print(dumps({ "scores": scores }), flush=True)