import axios from "axios";
import { serverApi } from "../../lib/config";

export interface Event {
  _id: string;
  title: string;
  desc: string;
  fullDesc: string;
  date: string;
  location: string;
  img: string;
  host?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

class EventService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getAllEvents(): Promise<Event[]> {
    try {
      const url = `${this.path}/event/all`;
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      throw err;
    }
  }

  public async getEvent(eventId: string): Promise<Event> {
    try {
      const url = `${this.path}/event/${eventId}`;
      const result = await axios.get(url);
      return result.data;
    } catch (err) {
      throw err;
    }
  }
}

export default EventService;
