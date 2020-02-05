// ==UserScript==
// @name         Calculates story points for selected JIRA tickets
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows the number of story points for selected JIRA tickets
// @match        https://jira.squarespace.net/*
// @grant        none
// ==/UserScript==
(function() {
  'use strict';

  const STORY_POINT_ELEMENT_CLASSNAME = 'storyPointsScript';
  const STORY_POINT_BADGE_CLASSNAME =
    '.ghx-selected:not(.ghx-filtered) [title="Story Points"]';

  function getStoryPointElement() {
    let storyPointEl = document.getElementsByClassName(
      STORY_POINT_ELEMENT_CLASSNAME
    )[0];

    if (!storyPointEl) {
      storyPointEl = document.createElement('div');
      storyPointEl.className = STORY_POINT_ELEMENT_CLASSNAME;
      storyPointEl.setAttribute(
        'style',
        `
        padding: 0 5px;
        position: absolute;
        bottom: 0;
        right: 0;
        background-color: black;
        color: white;
      `
      );
      document.body.appendChild(storyPointEl);
    }

    return storyPointEl;
  }

  function getStoryPoints() {
    const selectedBadgeEls = document.querySelectorAll(
      STORY_POINT_BADGE_CLASSNAME
    );

    if (selectedBadgeEls.length === 0) {
      return -1;
    }

    return Array.from(selectedBadgeEls).reduce((acc, el) => {
      return acc + Number(el.textContent);
    }, 0);
  }

  function setStoryPoints(storyPoints) {
    const storyPointEl = getStoryPointElement();
    storyPointEl.innerHTML = `Story Points: ${storyPoints}`;
  }

  function clearStoryPointEl() {
    const storyPointEl = getStoryPointElement();
    storyPointEl.remove();
  }

  document.body.addEventListener('mouseup', function() {
    window.setTimeout(function() {
      const storyPoints = getStoryPoints();

      if (storyPoints === -1) {
        clearStoryPointEl();
        return;
      }

      setStoryPoints(storyPoints);
    }, 0);
  });
})();
