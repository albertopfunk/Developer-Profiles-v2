import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

function UserCards({
  users,
  loadMoreUsers,
  usersToLoad,
  cardFocusIndex,
  isIdle,
  isBusy,
  isError,
  currentUsers,
  totalUsers,
  resetFilters,
}) {
  const profileCardRefs = useRef(users.map(() => React.createRef()));
  let focusOnNextCardRef = useRef();

  useEffect(() => {
    if (!focusOnNextCardRef.current) {
      return;
    }
    profileCardRefs.current[cardFocusIndex].current.focus();
    focusOnNextCardRef.current = false;
  }, [cardFocusIndex]);

  function backToTopFocus(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }
    profileCardRefs.current[0].current.focus();
  }

  function backToTop() {
    window.scrollTo(0, 0);
  }

  function loadMoreFocus(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }
    focusOnNextCardRef.current = true;
  }

  function userCardActions(action, index) {
    if (action === "start") {
      profileCardRefs.current[0].current.focus();
    }

    if (action === "end") {
      profileCardRefs.current[currentUsers - 1].current.focus();
    }

    if (action === "previous") {
      if (index === 0) {
        profileCardRefs.current[currentUsers - 1].current.focus();
        return;
      }
      profileCardRefs.current[index - 1].current.focus();
    }

    if (action === "next") {
      if (index === currentUsers - 1) {
        profileCardRefs.current[0].current.focus();
        return;
      }
      profileCardRefs.current[index + 1].current.focus();
    }
  }

  if (totalUsers === 0) {
    return (
      <Feed role="feed" aria-busy={isBusy} aria-labelledby="profiles-heading">
        <h2 id="profiles-heading" className="sr-only">
          Current Profiles
        </h2>
        <p>No Users Here!</p>
        <button type="reset" onClick={resetFilters}>
          reset filters
        </button>
      </Feed>
    );
  }

  return (
    <Feed role="feed" aria-busy={isBusy} aria-labelledby="profiles-heading">
      <h2 id="profiles-heading" className="sr-only">
        Current Profiles
      </h2>

      <div className="profiles-grid">
        
        {/* grid
        automatic columns depending on current cards
        single column until breakpoint of extra large screen
        centered cards
        centered controls with single and double columns */}

        {users.map((user, i) => {
          return (
            <UserCard
              ref={profileCardRefs.current[i]}
              key={user.id}
              userCardActions={userCardActions}
              index={i}
              totalUsers={totalUsers}
              userId={user.id}
              areaOfWork={user.area_of_work}
              email={user.public_email}
              image={user.image}
              firstName={user.first_name}
              lastName={user.last_name}
              currentLocation={user.current_location_name}
              summary={user.summary}
              title={user.desired_title}
              topSkills={user.top_skills_prev}
              additionalSkills={user.additional_skills_prev}
              github={user.github}
              twitter={user.twitter}
              linkedin={user.linkedin}
              portfolio={user.portfolio}
            />
          );
        })}
      </div>

      <div>
        {isIdle && usersToLoad ? (
          <button
            type="button"
            onClick={loadMoreUsers}
            onKeyDown={(e) => loadMoreFocus(e)}
          >
            Load More Profiles
          </button>
        ) : null}

        {isIdle && !usersToLoad ? (
          <div>
            <p>No more profiles to load</p>
            <button
              type="button"
              aria-label="no more profiles to load, back to top"
              onClick={backToTop}
              onKeyDown={(e) => backToTopFocus(e)}
            >
              Back to Top
            </button>
          </div>
        ) : null}

        {isBusy ? (
          <button type="button" disabled="true">
            Loading
          </button>
        ) : null}

        {isError ? (
          <div>
            <p>Error loading profiles</p>
            <button
              type="button"
              aria-label="error loading profiles, retry"
              onClick={loadMoreUsers}
              onKeyDown={(e) => loadMoreFocus(e)}
            >
              Retry
            </button>
          </div>
        ) : null}
      </div>
    </Feed>
  );
}

const Feed = styled.div`
  .profiles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
    justify-items: center;
    align-items: start;
    grid-gap: 20px;
  }

  .back-to-top {
    position: fixed;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
  }
`;

const MemoUserCards = React.memo(UserCards);

export default MemoUserCards;
