import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

const METRICS_BASE_URL = 'https://metrics-server-yjqf.onrender.com/v1';

const API_KEYS = {
  repairman: 'rKey123',
  electrician: 'eKey456',
};

export interface VisitorLocation {
  lat?: number;
  lon?: number;
  accuracy?: number;
  source?: 'gps' | 'approx' | 'none';
}

export interface VisitorDeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screen: { width: number; height: number };
  timezone: string;
}

export interface StartPayload {
  location: VisitorLocation;
  device: VisitorDeviceInfo;
}

export interface StatsResponseItem {
  day: string;
  hourBuckets: Record<string, number>;
  totalVisits: number;
  totalDurationMs: number;
  avgDurationMs: number;
}

export interface StatsEnvelope {
  tz: string;
  days: StatsResponseItem[];
}

export interface StartResponse {
  sessionId: string;
}

@Injectable({ providedIn: 'root' })
export class VisitorsService {
  private http = inject(HttpClient);

  private headers(app: keyof typeof API_KEYS = 'repairman') {
    return { headers: { 'x-api-key': API_KEYS[app] } };
  }

  startSession(payload: StartPayload, app: keyof typeof API_KEYS = 'repairman'): Observable<StartResponse> {
    return this.http.post<StartResponse>(`${METRICS_BASE_URL}/${app}/start`, payload, this.headers(app));
  }

  heartbeat(sessionId: string, app: keyof typeof API_KEYS = 'repairman'): Observable<void> {
    return this.http.post<void>(
      `${METRICS_BASE_URL}/${app}/heartbeat`,
      { sessionId },
      this.headers(app)
    );
  }

  end(sessionId: string, app: keyof typeof API_KEYS = 'repairman'): Observable<void> {
    return this.http.post<void>(`${METRICS_BASE_URL}/${app}/end`, { sessionId }, this.headers(app));
  }

  getStats(app: keyof typeof API_KEYS = 'repairman'): Observable<number> {
    return this.http
      .get<StatsEnvelope>(`${METRICS_BASE_URL}/${app}/stats`, this.headers(app))
      .pipe(map((env) => (env && Array.isArray(env.days) && env.days.length ? env.days[0].totalVisits : 0)));
  }
}


