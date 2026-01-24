# Events & Community API Specification

## Endpoint
`GET /api/events` or similar endpoint that returns an array of community events

## Response Format
The API should return a JSON array of event objects.

## Event Object Structure

### Required Fields

| Key | Type | Label/Description | Usage in UI |
|-----|------|-------------------|-------------|
| `title` | `string` | Event Title | Displayed as the main heading on the card |
| `desc` | `string` | Event Description | Short description shown on card, full description shown in modal |
| `date` | `string` | Event Date & Time | Displayed with calendar icon (e.g., "March 15, 2024, 6:00 PM" or "Every Saturday, 10:00 AM") |
| `location` | `string` | Event Location | Displayed with location icon (e.g., "Baraka Books, Main Branch") |
| `img` | `string` | Event Image URL | Image displayed at top of card and in modal. Can be relative path (e.g., "/img/event.jpg") or full URL |

### Optional Fields

| Key | Type | Label/Description | Usage in UI |
|-----|------|-------------------|-------------|
| `host` | `string` | Event Host/Organizer | Displayed with person icon as "Host: {host}". Can be "Baraka Books Team", "Baraka Books Community", or any other community name. If not provided, host section is hidden. |

## Example Response

```json
[
  {
    "title": "Author Talk: Contemporary Fiction",
    "desc": "Join us for an evening with local authors discussing contemporary fiction and the writing process.",
    "host": "Baraka Books Team",
    "date": "March 15, 2024, 6:00 PM",
    "location": "Baraka Books, Main Branch",
    "img": "/img/f65ad1f333898ddd4dc109b31026dd95.jpg"
  },
  {
    "title": "Monthly Book Club Meeting",
    "desc": "Our community book club meets monthly to discuss selected titles. This month: 'The Midnight Library' by Matt Haig.",
    "host": "Baraka Books Community",
    "date": "March 20, 2024, 7:00 PM",
    "location": "Baraka Books, Reading Corner",
    "img": "/img/18ce181b0e85ea113340f82ecccbc1b9.jpg"
  },
  {
    "title": "Children's Story Time",
    "desc": "Weekly story time for children ages 3-8. Interactive reading, songs, and activities to spark a love of books.",
    "host": "Baraka Books Team",
    "date": "Every Saturday, 10:00 AM",
    "location": "Baraka Books, Children's Section",
    "img": "/img/1dbe2415185a55d2ec24e1b4dfcb4971.jpg"
  },
  {
    "title": "Writing Workshop: Creative Nonfiction",
    "desc": "Learn the art of creative nonfiction writing in this hands-on workshop. Perfect for aspiring memoirists and essay writers.",
    "host": "Local Writers Guild",
    "date": "March 25, 2024, 2:00 PM",
    "location": "Baraka Books, Workshop Room",
    "img": "/img/f65ad1f333898ddd4dc109b31026dd95.jpg"
  }
]
```

## Field Details

### `title` (Required)
- **Type**: String
- **Max Length**: Recommended 60-80 characters for best display
- **Example**: "Author Talk: Contemporary Fiction"
- **Usage**: Main heading on event card

### `desc` (Required)
- **Type**: String
- **Max Length**: Recommended 100-150 characters for card preview (can be longer for modal)
- **Example**: "Join us for an evening with local authors discussing contemporary fiction and the writing process."
- **Usage**: Short description on card, full description in modal when "Learn More" is clicked

### `host` (Optional)
- **Type**: String
- **Example Values**: 
  - "Baraka Books Team"
  - "Baraka Books Community"
  - "Local Writers Guild"
  - Any community organization name
- **Usage**: Displayed as "Host: {host}" with person icon. If omitted, host section is not shown.

### `date` (Required)
- **Type**: String
- **Format**: Human-readable date/time string
- **Examples**: 
  - "March 15, 2024, 6:00 PM" (specific date/time)
  - "Every Saturday, 10:00 AM" (recurring event)
  - "March 20, 2024, 7:00 PM"
- **Usage**: Displayed with calendar icon

### `location` (Required)
- **Type**: String
- **Examples**: 
  - "Baraka Books, Main Branch"
  - "Baraka Books, Reading Corner"
  - "Baraka Books, Children's Section"
  - "Baraka Books, Workshop Room"
- **Usage**: Displayed with location icon

### `img` (Required)
- **Type**: String (URL or path)
- **Format**: 
  - Relative path: "/img/event.jpg"
  - Full URL: "https://example.com/images/event.jpg"
- **Recommended**: 
  - Aspect ratio: 16:9 or 4:3
  - Minimum width: 360px
  - Format: JPG, PNG, or WebP
- **Usage**: Displayed as card image and in modal

## Empty State

If no events are available, return an empty array `[]`. The UI will display:
- **Title**: "No Upcoming Events"
- **Message**: "We're currently planning exciting community events. Check back soon for author talks, book clubs, workshops, and more!"

## Notes

1. All fields except `host` are required. If any required field is missing, the event may not display correctly.
2. The `desc` field is used both for the card preview and the modal detail view.
3. Images should be optimized for web (compressed, appropriate size).
4. Date format should be human-readable and localized if needed.
5. The component currently uses `author` field name but expects `host` - backend should use `host` key.
