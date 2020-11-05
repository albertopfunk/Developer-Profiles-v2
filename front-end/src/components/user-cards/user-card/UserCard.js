import React, { useState, useEffect } from "react";
import styled from "styled-components";

import UserImage from "./UserImage";
import UserInfo from "./UserInfo";
import UserTitle from "./UserTitle";
import UserSkills from "./UserSkills";
import UserIcons from "./UserIcons";
import UserExtras from "../user-extras/UserExtras";

import { httpClient } from "../../../global/helpers/http-requests";

// resume link?
// codesandbox link?
// codepen link?
// share profile?

// missing aria
/*
https://www.w3.org/TR/wai-aria-practices/examples/feed/feedDisplay.html
aria-label
aria-describedby
*/

// Keyboard control
/*
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Feed_Role
Page Down: Move focus to next article.
Page Up: Move focus to previous article.
Control + End: Move focus to the first focusable element after the feed.
Control + Home: Move focus to the first focusable element before the feed.
*/

const UserCard = React.forwardRef((props, articleRef) => {
  const [userExtras, setUserExtras] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [noExtras, setNoExtras] = useState(false);
  const [hasRequestedExtras, setHasRequestedExtras] = useState(false);

  useEffect(() => {
    if (props.userExtras) {
      setIsCardExpanded(false);
      setHasRequestedExtras(true);
      setUserExtras(props.userExtras);

      if (
        props.userExtras.locations.length === 0 &&
        props.userExtras.topSkills.length === 0 &&
        props.userExtras.additionalSkills.length === 0 &&
        props.userExtras.education.length === 0 &&
        props.userExtras.experience.length === 0 &&
        props.userExtras.projects.length === 0
      ) {
        setNoExtras(true);
      } else {
        setNoExtras(false);
      }
    }
  }, [props.userExtras]);

  async function expandUserCard() {
    if (hasRequestedExtras) {
      setIsCardExpanded(true);
      return;
    }

    setLoadingExtras(true);
    const [res, err] = await httpClient(
      "GET",
      `/users/get-extras/${props.userId}`
    );

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (
      res.data.locations.length === 0 &&
      res.data.topSkills.length === 0 &&
      res.data.additionalSkills.length === 0 &&
      res.data.education.length === 0 &&
      res.data.experience.length === 0 &&
      res.data.projects.length === 0
    ) {
      setUserExtras({});
      setNoExtras(true);
      setHasRequestedExtras(true);
      setIsCardExpanded(true);
      setLoadingExtras(false);
      return;
    }

    setUserExtras(res.data);
    setNoExtras(false);
    setHasRequestedExtras(true);
    setIsCardExpanded(true);
    setLoadingExtras(false);
  }

  function closeUserCard() {
    setIsCardExpanded(false);
  }

  return (
    <article
      ref={articleRef}
      id="profile-card"
      tabIndex="-1"
      aria-posinset={props.index}
      aria-setsize={props.totalUsers}
      aria-labelledby="profile-heading"
    >
      <h3 id="profile-heading">{`${props.firstName || "user"}'s Profile`}</h3>
      {/* <aside className="favorite">Favorite</aside> */}

      <UserSection>
        <div>
          <div>
            <strong>{props.userId}</strong>

            <UserImage previewImg={props.previewImg} image={props.image} />

            <UserInfo
              firstName={props.firstName}
              lastName={props.lastName}
              currentLocation={props.currentLocation}
              summary={props.summary}
            />
          </div>

          <UserTitle title={props.title} />

          <UserSkills
            topSkills={props.topSkills}
            additionalSkills={props.additionalSkills}
          />
        </div>

        <UserIcons
          github={props.github}
          twitter={props.twitter}
          linkedin={props.linkedin}
          portfolio={props.portfolio}
        />
      </UserSection>

      <section>
        {!isCardExpanded ? (
          <button disabled={loadingExtras} onClick={expandUserCard}>
            Expand
          </button>
        ) : (
          <button onClick={closeUserCard}>Close</button>
        )}
      </section>

      {isCardExpanded ? (
        <UserExtras userExtras={userExtras} noExtras={noExtras} />
      ) : null}
    </article>
  );
});

const UserSection = styled.section`
  border: solid green;
  display: flex;
  > div {
    > div {
      display: flex;
    }
  }
`;

export default UserCard;
