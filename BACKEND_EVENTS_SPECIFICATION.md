# Backend API Specification: Events & Community

## Overview
This document specifies the exact data structure and fields required for the Events & Community section on the homepage. The section displays community events (author talks, book clubs, workshops, etc.) in a horizontal scrollable card layout.

---

## API Endpoint
**Endpoint**: `GET /api/events` (or your preferred endpoint)  
**Response**: JSON array of event objects  
**Empty State**: Return empty array `[]` if no events available

---

## Event Object Structure

### Complete Field List

| Field Name | Type | Required | Max Length | Description |
|------------|------|----------|------------|-------------|
| `title` | string | ✅ Yes | 80 chars | Event title displayed as main heading |
| `desc` | string | ✅ Yes | 150 chars | Short description shown on card preview |
| `fullDesc` | string | ✅ Yes | 1000 chars | Full detailed description shown in modal |
| `date` | string | ✅ Yes | 50 chars | Human-readable date and time |
| `location` | string | ✅ Yes | 100 chars | Event location/venue |
| `img` | string | ✅ Yes | - | Image URL or path |
| `host` | string | ❌ No | 100 chars | Event host/organizer name |

---

## Field Specifications

### 1. `title` (Required)
- **Type**: String
- **Required**: Yes
- **Max Length**: 80 characters (recommended)
- **Purpose**: Main heading on event card
- **Examples**:
  - "Author Talk: Contemporary Fiction"
  - "Monthly Book Club Meeting"
  - "Children's Story Time"
  - "Writing Workshop: Creative Nonfiction"
  - "Reading Challenge Kickoff"

### 2. `desc` (Required) - Short Description
- **Type**: String
- **Required**: Yes
- **Max Length**: 150 characters (recommended)
- **Purpose**: Brief preview text shown on the event card
- **Display**: Visible on card, truncated if too long
- **Examples**:
  - "Join us for an evening with local authors discussing contemporary fiction and the writing process."
  - "Our community book club meets monthly to discuss selected titles. This month: 'The Midnight Library' by Matt Haig."
  - "Weekly story time for children ages 3-8. Interactive reading, songs, and activities."

### 3. `fullDesc` (Required) - Full Description
- **Type**: String
- **Required**: Yes
- **Max Length**: 1000 characters (recommended)
- **Purpose**: Complete event details shown when user clicks "Learn More" button
- **Display**: Only visible in modal/detail view
- **Content Should Include**:
  - Detailed event description
  - What attendees will experience
  - Who should attend
  - What to bring (if applicable)
  - Registration requirements (if any)
  - Any special instructions
- **Example**:
  ```
  "Join us for an engaging evening with local authors as they discuss contemporary fiction and share insights into their writing process. This event features a panel discussion followed by Q&A session where you can ask questions about craft, inspiration, and the publishing journey. Light refreshments will be served. Perfect for aspiring writers, avid readers, and anyone interested in the literary world. No registration required, but seating is limited."
  ```

### 4. `date` (Required)
- **Type**: String
- **Required**: Yes
- **Max Length**: 50 characters
- **Format**: Human-readable date and time string
- **Purpose**: Displayed with calendar icon
- **Examples**:
  - "March 15, 2024, 6:00 PM" (specific date/time)
  - "Every Saturday, 10:00 AM" (recurring event)
  - "March 20, 2024, 7:00 PM"
  - "April 1-5, 2024, Daily at 2:00 PM" (multi-day event)

### 5. `location` (Required)
- **Type**: String
- **Required**: Yes
- **Max Length**: 100 characters
- **Purpose**: Displayed with location icon
- **Examples**:
  - "Baraka Books, Main Branch"
  - "Baraka Books, Reading Corner"
  - "Baraka Books, Children's Section"
  - "Baraka Books, Workshop Room"
  - "Baraka Books, Community Hall"

### 6. `img` (Required) - Image
- **Type**: String (URL or file path)
- **Required**: Yes
- **Format**: 
  - Relative path: `/img/events/author-talk.jpg`
  - Full URL: `https://yourdomain.com/images/events/author-talk.jpg`
- **Image Requirements**:
  - **Aspect Ratio**: 16:9 or 4:3 (recommended)
  - **Minimum Dimensions**: 360px width × 200px height
  - **Recommended Dimensions**: 720px × 405px (16:9) or 720px × 540px (4:3)
  - **File Format**: JPG, PNG, or WebP
  - **File Size**: Optimized for web (under 200KB recommended)
  - **Quality**: High quality, clear images that represent the event
- **Purpose**: Displayed as card image and in modal detail view
- **Examples**:
  - `/img/events/author-talk-2024.jpg`
  - `/uploads/events/book-club-march.jpg`
  - `https://cdn.example.com/events/workshop-creative-writing.jpg`

### 7. `host` (Optional)
- **Type**: String
- **Required**: No
- **Max Length**: 100 characters
- **Purpose**: Event organizer/host name, displayed as "Host: {host}"
- **Display**: Only shown if provided, with person icon
- **Examples**:
  - "Baraka Books Team"
  - "Baraka Books Community"
  - "Local Writers Guild"
  - "Tashkent Reading Circle"
  - "Children's Literature Society"
- **Note**: If not provided, the host section is hidden on the card

---

## Complete Example Response

```json
[
  {
    "title": "Author Talk: Contemporary Fiction",
    "desc": "Join us for an evening with local authors discussing contemporary fiction and the writing process.",
    "fullDesc": "Join us for an engaging evening with local authors as they discuss contemporary fiction and share insights into their writing process. This event features a panel discussion with three published authors who will talk about their latest works, the challenges of writing in today's literary landscape, and their creative journeys. Following the panel, there will be a Q&A session where attendees can ask questions about craft, inspiration, and the publishing journey. Light refreshments will be served. This event is perfect for aspiring writers, avid readers, and anyone interested in the literary world. No registration required, but seating is limited to 50 attendees on a first-come, first-served basis.",
    "host": "Baraka Books Team",
    "date": "March 15, 2024, 6:00 PM",
    "location": "Baraka Books, Main Branch",
    "img": "/img/events/author-talk-march-2024.jpg"
  },
  {
    "title": "Monthly Book Club Meeting",
    "desc": "Our community book club meets monthly to discuss selected titles. This month: 'The Midnight Library' by Matt Haig.",
    "fullDesc": "Join our vibrant community book club for our monthly discussion of 'The Midnight Library' by Matt Haig. This thought-provoking novel explores themes of regret, possibility, and the infinite potential of life. We'll discuss the book's philosophical questions, character development, and what it means to live a life without regrets. Whether you've finished the book or are still reading, all perspectives are welcome. The discussion will be moderated by our book club coordinator, and we'll explore different interpretations and personal connections to the story. Light refreshments and tea will be provided. New members are always welcome!",
    "host": "Baraka Books Community",
    "date": "March 20, 2024, 7:00 PM",
    "location": "Baraka Books, Reading Corner",
    "img": "/img/events/book-club-march-2024.jpg"
  },
  {
    "title": "Children's Story Time",
    "desc": "Weekly story time for children ages 3-8. Interactive reading, songs, and activities to spark a love of books.",
    "fullDesc": "Bring your little ones for our weekly children's story time! This interactive session is designed for children ages 3-8 and features engaging storytelling, sing-along songs, and fun activities that spark a love of reading. Each week, we read a carefully selected picture book, followed by related crafts or games. This is a great opportunity for children to develop listening skills, expand their vocabulary, and discover new favorite books. Parents and caregivers are welcome to join in the fun. The session lasts approximately 45 minutes. No registration needed, just drop in!",
    "host": "Baraka Books Team",
    "date": "Every Saturday, 10:00 AM",
    "location": "Baraka Books, Children's Section",
    "img": "/img/events/children-story-time.jpg"
  },
  {
    "title": "Writing Workshop: Creative Nonfiction",
    "desc": "Learn the art of creative nonfiction writing in this hands-on workshop. Perfect for aspiring memoirists and essay writers.",
    "fullDesc": "Discover the art of creative nonfiction in this comprehensive hands-on workshop led by experienced writers. Over the course of three hours, you'll learn techniques for transforming real-life experiences into compelling narratives. We'll cover memoir writing, personal essays, literary journalism, and how to balance truth with storytelling. The workshop includes writing exercises, peer feedback sessions, and discussions about publishing opportunities. Perfect for aspiring memoirists, essay writers, and anyone interested in telling true stories with literary flair. Please bring a notebook and pen. Limited to 15 participants. Registration required.",
    "host": "Local Writers Guild",
    "date": "March 25, 2024, 2:00 PM",
    "location": "Baraka Books, Workshop Room",
    "img": "/img/events/writing-workshop-nonfiction.jpg"
  }
]
```

---

## Empty State Response

If no events are available, return an empty array:

```json
[]
```

The frontend will automatically display:
- **Title**: "No Upcoming Events"
- **Message**: "We're currently planning exciting community events. Check back soon for author talks, book clubs, workshops, and more!"

---

## Important Notes

1. **Two Description Fields**: 
   - `desc`: Short preview (150 chars max) - shown on card
   - `fullDesc`: Complete details (1000 chars max) - shown in modal

2. **Image Requirements**: 
   - Must be valid URL or path
   - Should be optimized for web
   - Recommended aspect ratio: 16:9 or 4:3
   - Minimum: 360px × 200px

3. **Field Validation**:
   - All fields except `host` are required
   - Missing required fields may cause display issues
   - Empty strings should be treated as missing

4. **Date Format**: 
   - Use human-readable format
   - Include both date and time when applicable
   - Support recurring events (e.g., "Every Saturday")

5. **Host Field**: 
   - Optional but recommended
   - If provided, displayed as "Host: {host}"
   - If omitted, host section is hidden

6. **Ordering**: 
   - Events should be ordered by date (upcoming first)
   - Past events can be included if needed

---

## Error Handling

- **No Events**: Return empty array `[]`
- **Invalid Data**: Validate all required fields before sending
- **Missing Image**: Provide a default/placeholder image path if event image is unavailable
- **Malformed Date**: Ensure date string is human-readable and properly formatted

---

## Testing Checklist

- [ ] All required fields present
- [ ] `desc` is short (≤150 chars) and appropriate for card preview
- [ ] `fullDesc` is detailed (≤1000 chars) and complete
- [ ] `img` paths are valid and images are accessible
- [ ] `date` is human-readable
- [ ] `host` is optional and works when omitted
- [ ] Empty array returns correctly
- [ ] Multiple events display correctly
- [ ] Images load properly

---

## Questions or Clarifications?

If you need any clarification on these requirements, please contact the frontend team.
