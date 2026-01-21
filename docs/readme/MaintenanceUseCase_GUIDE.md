# MaintenanceUseCase Guide

This guide shows how to use `MaintenanceUseCase` to check if your app should display a maintenance screen or proceed with normal operation.

## Getting an Instance

```kotlin
val maintenance = BuzzebeesSDK.instance().maintenance
```

---

## checkMaintenanceStatus

Check maintenance status using configured CDN URL and App ID.

- Response (`MaintenanceResult`)

### MaintenanceResult

| Type             | Description                                      |
|------------------|--------------------------------------------------|
| UnderMaintenance | App is under maintenance - show maintenance popup |
| Operational      | App is operational - proceed normally            |

### UnderMaintenance Properties

| Property       | Type                      | Description                        |
|----------------|---------------------------|------------------------------------|
| maintenance    | Maintenance               | Raw maintenance data from API      |
| displayContent | MaintenanceDisplayContent | Display content for both languages |
| buttonAction   | MaintenanceButtonAction   | Action when button is clicked      |

### MaintenanceDisplayContent

| Property     | Type   | Description         |
|--------------|--------|---------------------|
| headerTh     | String | Thai header         |
| messageTh    | String | Thai message        |
| buttonTextTh | String | Thai button text    |
| headerEn     | String | English header      |
| messageEn    | String | English message     |
| buttonTextEn | String | English button text |

### MaintenanceButtonAction

| Type     | Description                                      |
|----------|--------------------------------------------------|
| OpenUrl  | Open URL in browser (when `landing_url` exists)  |
| CloseApp | Close/Exit the app (when `landing_url` is empty) |

- Usage

```kotlin
// Suspend
val result = maintenance.checkMaintenanceStatus()

// Callback
maintenance.checkMaintenanceStatus { result ->
    when (result) {
        is MaintenanceResult.UnderMaintenance -> {
            // Show maintenance dialog
            val content = result.displayContent
            showDialog(
                header = content.headerTh.ifEmpty { content.headerEn },
                message = content.messageTh.ifEmpty { content.messageEn },
                buttonText = content.buttonTextTh.ifEmpty { content.buttonTextEn }
            )
            
            // Handle button action
            when (val action = result.buttonAction) {
                is MaintenanceButtonAction.OpenUrl -> openBrowser(action.url)
                is MaintenanceButtonAction.CloseApp -> finishAffinity()
            }
        }
        is MaintenanceResult.Operational -> {
            // Proceed to app normally
            navigateToHome()
        }
    }
}
```

---

## checkMaintenanceStatus (Custom URL)

Check maintenance status from a specific URL.

- Request

| Field | Type   | Mandatory | Description                       |
|-------|--------|-----------|-----------------------------------|
| url   | String | M         | Full URL to maintenance JSON file |

- Response: Same as above

- Usage

```kotlin
// Suspend
val result = maintenance.checkMaintenanceStatus("https://cdn.example.com/maintenance.json")

// Callback
maintenance.checkMaintenanceStatus("https://cdn.example.com/maintenance.json") { result ->
    when (result) {
        is MaintenanceResult.UnderMaintenance -> {
            // Show maintenance dialog
        }
        is MaintenanceResult.Operational -> {
            // Proceed normally
        }
    }
}
```

---

## Summary

| Method                        | Description                             |
|-------------------------------|-----------------------------------------|
| `checkMaintenanceStatus()`    | Check using configured CDN URL + App ID |
| `checkMaintenanceStatus(url)` | Check using custom URL                  |

**Note:** If API call fails (network error, 404, invalid JSON), the result defaults to `Operational` to ensure users can always access the app.
