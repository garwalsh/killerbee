# Specification: Spelling Bee Clone - "WordHive"

## Metadata
- **ID**: 0001-spelling-bee-clone
- **Status**: draft
- **Created**: 2025-11-17
- **Protocol**: SPIDER-SOLO

## Clarifying Questions Asked

**Q: What type of puzzle game are you envisioning?**
A: A clone of the NYT Games' Spelling Bee but with different aesthetics and rules

**Q: What platform(s) should this run on?**
A: Web browser, should be responsive to be played in the browser on a phone

**Q: What level of complexity are you targeting?**
A: Simple prototype

**Q: Do you want multiplayer or social features?**
A: Single-player only

**Q: What rule variations do you want from the original Spelling Bee?**
A: Modified scoring system - users score more points for rare words. When a puzzle is generated, the list of possible words is ranked from most common to least common. 4-letter words score 1, longer words score their number of letters. The word list is split into 10 roughly equal sections based on rarity. If a player uses a 5-letter word from the rarest section, they score 5 + 10 = 15 points.

**Q: What visual style are you thinking for the aesthetics?**
A: Retro/pixel art style

**Q: Do you want daily puzzle functionality like NYT?**
A: Yes, daily puzzles (same puzzle for all players each day, resets at midnight)

**Q: Do you have a preference for the tech stack?**
A: React + TypeScript

## Problem Statement

Word puzzle game enthusiasts enjoy games like NYT's Spelling Bee, but may want different visual aesthetics (retro/pixel art instead of modern minimalism) and a scoring system that rewards vocabulary depth rather than just word length. The current Spelling Bee treats all words of the same length equally, which doesn't incentivize players to think of less common words.

A new implementation with a rarity-based scoring system would:
- Reward players for knowing uncommon vocabulary
- Maintain the addictive core gameplay of Spelling Bee
- Provide a fresh aesthetic experience with retro/pixel art design
- Offer daily challenges that players can share and compare

## Current State

This is a greenfield project. No existing codebase. The user wants to build this from scratch using modern web technologies (React + TypeScript).

## Desired State

A fully functional web-based word puzzle game with:
- Retro/pixel art aesthetic
- Spelling Bee-style gameplay (7 letters, 1 center letter that must be used)
- Rarity-based scoring system that rewards uncommon words
- Daily puzzle functionality (same puzzle for everyone each day)
- Responsive design working on both desktop and mobile browsers
- Simple prototype quality (no user accounts, advanced features, or monetization)

## Stakeholders

- **Primary Users**: The user (developer) and word puzzle game enthusiasts
- **Secondary Users**: None (single-player game)
- **Technical Team**: Solo developer (the user)
- **Business Owners**: The user

## Success Criteria

- [ ] Game displays 7 letters in a hexagonal arrangement (6 outer, 1 center)
- [ ] Center letter is visually distinct (different color/highlight)
- [ ] Players can form words by clicking letters in sequence
- [ ] Only words using the center letter are accepted
- [ ] Words must be at least 4 letters long
- [ ] Game validates words against a word list
- [ ] Scoring system correctly implements: base score (1 for 4-letter, length for 5+) + rarity bonus (0-10 based on word frequency decile)
- [ ] Game shows current score and list of found words
- [ ] Daily puzzle is consistent for all players on the same day
- [ ] Puzzle resets at midnight local time
- [ ] Responsive design works on mobile (portrait) and desktop
- [ ] Retro/pixel art aesthetic is implemented consistently
- [ ] All tests pass with >80% coverage (adjusted for prototype)
- [ ] Game is playable and functional

## Constraints

### Technical Constraints
- Must run in modern web browsers (Chrome, Firefox, Safari, Edge)
- React + TypeScript stack
- No backend server required initially (can use localStorage for daily puzzle tracking)
- Must work on mobile browsers (responsive design)
- Should use public domain or free word list data
- Should use word frequency data for rarity scoring

### Business Constraints
- Simple prototype scope (no advanced features)
- Solo developer project
- No budget for paid APIs or services
- No user authentication system needed

## Assumptions

- Word list can be sourced from public domain sources (e.g., SCOWL, enable word list)
- Word frequency data available from public sources (e.g., Google NGrams, word frequency lists)
- Daily puzzle generation can be deterministic (same seed = same puzzle for that date)
- LocalStorage is acceptable for tracking player progress (no persistence across devices)
- Pixel art assets can be created or sourced from free resources
- Players will use modern browsers with ES6+ JavaScript support

## Solution Approaches

### Approach 1: Client-Only React App with Embedded Word Data

**Description**: Build a fully client-side React + TypeScript application with word lists and frequency data embedded as JSON. Use date-based seeding to generate consistent daily puzzles. Store user progress in localStorage.

**Technical Design**:
- React components for game board, letter tiles, input display, score panel
- TypeScript for type safety
- Word list (filtered to 4+ letter words) embedded as JSON (~50-100KB)
- Word frequency data as separate JSON mapping words to frequency ranks
- Deterministic puzzle generation using date as seed
- CSS with pixel art styling (possibly using a retro web framework or custom CSS)
- LocalStorage for user's found words and score for current day

**Pros**:
- Simple deployment (static hosting, GitHub Pages, Netlify, Vercel)
- No backend needed
- Fast loading (everything client-side)
- Works offline after initial load
- Easy to develop and test

**Cons**:
- Word list and frequency data exposed (users could cheat)
- No cross-device sync
- Limited to localStorage size constraints
- Puzzle generation algorithm is visible to users
- Cannot prevent users from changing system date to access future puzzles

**Estimated Complexity**: Low-Medium
**Risk Level**: Low

### Approach 2: Client-Side App with Backend API

**Description**: React frontend with a simple backend API (Node.js/Express or serverless functions) that provides daily puzzles and word validation.

**Technical Design**:
- React + TypeScript frontend
- Backend API (Node.js/Express or serverless)
- Backend generates and serves daily puzzle
- Backend validates submitted words
- Word list and frequency data kept server-side
- Optional: Store user progress server-side (with user IDs)

**Pros**:
- Word list and puzzle generation hidden from users (harder to cheat)
- Can add cross-device sync later
- Can add analytics and tracking
- More professional/scalable architecture
- Can add social features later

**Cons**:
- More complex deployment (need backend hosting)
- Requires API development
- Slower initial development
- May need CORS configuration
- Costs for backend hosting (though minimal for low traffic)
- Overkill for "simple prototype" requirement

**Estimated Complexity**: Medium-High
**Risk Level**: Medium

### Approach 3: Hybrid - Client-Side with Pre-Generated Puzzles

**Description**: Generate puzzles ahead of time (e.g., 365 days worth) and embed them as JSON data in the client. Keep word validation client-side but puzzles are pre-determined.

**Technical Design**:
- Generate 365 daily puzzles offline using a script
- Embed puzzles as JSON array in the app
- Client looks up puzzle based on current date index
- Word list embedded for validation
- No backend needed

**Pros**:
- Simple deployment like Approach 1
- Puzzles are "fixed" and can't be manipulated by date-seed algorithm tweaking
- Still no backend needed
- Can curate/test puzzles before deployment

**Cons**:
- Still client-side (users can inspect and see future puzzles)
- Limited to pre-generated puzzle count
- Need to redeploy to add more puzzles
- Larger initial bundle size

**Estimated Complexity**: Low-Medium
**Risk Level**: Low

### Recommended Approach: Approach 1 (Client-Only with Embedded Data)

For a simple prototype, Approach 1 best fits the requirements. The user specified "simple prototype" and "single-player only", so the complexity of a backend is not justified. The risk of cheating is acceptable for a prototype, and the simplicity of deployment and development outweighs the cons.

## Open Questions

### Critical (Blocks Progress)
- [ ] Which word list should we use? (SCOWL, enable, Wordle word list, or other?)
- [ ] Which word frequency dataset? (Google Books Ngrams, SUBTLEX, or other?)
- [ ] Should "pangrams" (words using all 7 letters) get a bonus like in Spelling Bee?

### Important (Affects Design)
- [ ] Should the game show the total number of possible words?
- [ ] Should there be a maximum score display (sum of all possible words)?
- [ ] How should the UI indicate word rarity visually? (color coding, stars, text label?)
- [ ] Should found words be displayed in any particular order? (alphabetical, by score, by time found?)
- [ ] Should there be animations for correct/incorrect word submissions?

### Nice-to-Know (Optimization)
- [ ] Should there be a "shuffle" button to rearrange outer letters?
- [ ] Should there be any hints system? (e.g., show first letter of unfound words)
- [ ] Should there be sound effects?
- [ ] Should there be a "definition" lookup for found words?

## Performance Requirements

- **Response Time**: Letter clicks should respond instantly (<50ms)
- **Load Time**: Initial page load <3 seconds on 3G connection
- **Word Validation**: Word validation should complete <100ms
- **Resource Usage**: Total bundle size <2MB (including word data)
- **Availability**: Static site should have 99%+ uptime (depends on hosting)

## Security Considerations

- **Data Privacy**: No user accounts, no personal data collected (for prototype)
- **Cheating**: Acceptable risk for prototype - word lists will be exposed in client-side code
- **XSS**: Sanitize any user input (typed words) before displaying, though limited attack surface
- **CORS**: Not applicable (no backend API)

## Test Scenarios

### Functional Tests
1. **Happy Path**: User clicks letters to form a valid word (e.g., "HELLO"), word is accepted, score increases, word appears in found list
2. **Invalid Word**: User enters "XYZQ", word is rejected, no score change, error message shown
3. **Word Without Center Letter**: User tries "BOOK" when center letter is "A", word is rejected
4. **Too Short Word**: User tries "CAT" (3 letters), word is rejected (minimum 4 letters)
5. **Duplicate Word**: User enters "HELLO" twice, second attempt rejected with "already found" message
6. **Rarity Scoring**: User enters common word "GOOD" (scores base points) vs rare word "QUIXOTIC" (scores base + high rarity bonus)
7. **Daily Puzzle Consistency**: Two users on the same day see identical 7-letter puzzle
8. **Midnight Reset**: User plays puzzle, waits until midnight, sees new puzzle with reset score

### Non-Functional Tests
1. **Mobile Responsiveness**: Game UI scales properly on iPhone SE (375px width) through desktop (1920px)
2. **Touch Input**: Letter tiles work correctly with touch events on mobile devices
3. **Performance**: Word validation completes in <100ms for word list of 50,000+ words
4. **Accessibility**: Game is keyboard-navigable (tab through letters, enter to submit)
5. **Pixel Art Aesthetic**: Visual design matches retro/pixel art theme consistently

## Dependencies

### External Services
- None (client-only app)

### Internal Systems
- None (greenfield project)

### Libraries/Frameworks
- **React** (v18+): UI framework
- **TypeScript** (v5+): Type safety
- **Vite** or **Create React App**: Build tool
- **CSS/SCSS**: Styling (possibly with pixel art CSS framework)
- Optional: **seedrandom** or similar for deterministic random puzzle generation
- Optional: **date-fns** or native Date API for date handling

### Data Sources
- **Word List**: Public domain word list (SCOWL, enable, or similar)
- **Word Frequency Data**: Public frequency list (Google Books Ngrams, SUBTLEX, etc.)
- **Pixel Art Assets**: Free pixel fonts, icons (or create custom)

## References

- NYT Spelling Bee (for gameplay reference): https://www.nytimes.com/puzzles/spelling-bee
- SCOWL Word Lists: http://wordlist.aspell.net/
- Word Frequency Data: https://www.wordfrequency.info/ or https://github.com/hermitdave/FrequencyWords
- Pixel Art CSS Frameworks: https://nostalgic-css.github.io/NES.css/ or custom CSS

## Risks and Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|------------|--------|-------------------|
| Word list has offensive words | Medium | Medium | Filter word list or use curated source |
| Word frequency data quality is poor | Low | Medium | Test with multiple frequency sources, choose best |
| Puzzle generation creates unsolvable/boring puzzles | Medium | High | Add validation rules (min word count, letter distribution) |
| Mobile performance issues with large word list | Low | Medium | Optimize word validation (hash map, binary search) |
| Date-based seeding produces duplicate puzzles | Low | Low | Use robust seeding algorithm with year + day-of-year |
| Pixel art design looks unprofessional | Medium | Low | Use established pixel fonts and consistent design system |

## Expert Consultation

**Note**: This specification was created using SPIDER-SOLO protocol (single-agent workflow). Multi-agent consultation with GPT-5 and Gemini Pro was not performed due to Zen MCP server unavailability.

## Approval

- [ ] Technical Lead Review (User)
- [ ] Product Owner Review (User)
- [ ] Stakeholder Sign-off (User)

## Notes

### Game Rules Summary (Spelling Bee Clone)
- 7 letters displayed (6 outer, 1 center in different color)
- Form words by clicking letters in sequence
- Words must:
  - Be at least 4 letters long
  - Use the center letter at least once
  - Use only the 7 provided letters (can repeat letters)
  - Be valid English words in the word list
- Cannot reuse same word twice

### Scoring System
- **4-letter words**: 1 point
- **5+ letter words**: base score = word length
- **Rarity bonus**:
  - All valid words in puzzle sorted by frequency (common to rare)
  - Split into 10 deciles (sections)
  - Decile 1 (most common): +0 bonus
  - Decile 2: +1 bonus
  - ...
  - Decile 10 (rarest): +10 bonus
- **Total score** = base score + rarity bonus
- Example: "QUEEN" (5 letters, decile 8) = 5 + 8 = 13 points

### Daily Puzzle Generation
- Use current date (YYYY-MM-DD) as seed
- Generate same 7 letters for everyone on that date
- Reset at midnight local time
- Players can only play current day's puzzle (no archive for prototype)

### Open Design Decisions for User
1. Should pangrams (words using all 7 letters) get a bonus?
2. Should we show total possible words count and max score?
3. How to visually indicate word rarity? (color code, badges, text?)
4. Include shuffle button for letters?
5. Which specific word list and frequency data source?
