#!/usr/bin/env python3
# GA4 Data API config — created by ga-connect skill
PROPERTY_ID = "528507004"
SA_PATH = os.path.expanduser("~/.claude/ai-paper-analytics-sa.json")

import os
from google.analytics.data_v1beta import BetaAnalyticsDataClient
from google.oauth2 import service_account

credentials = service_account.Credentials.from_service_account_file(
    SA_PATH,
    scopes=["https://www.googleapis.com/auth/analytics.readonly"],
)
client = BetaAnalyticsDataClient(credentials=credentials)
