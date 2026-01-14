# Buzzebees SDK for Android

The Buzzebees SDK provides core functionalities for your Android application, including authentication, real-time badge management, and custom API integration. This guide covers SDK integration and all available features.

> 📋 **Quick Reference**: For a complete overview of all SDK capabilities, see the [**SDK Comprehensive Guide**](docs/readme/SDK_COMPREHENSIVE_GUIDE.md)

## ✨ What's New in This Enhanced Version

This version of the Buzzebees SDK includes enhanced features not found in the standard documentation:

- ⭐ **Custom API Integration**: Create your own API services using SDK's pre-configured HTTP infrastructure
- 🔗 **URL Builder Extensions**: Convenient URL building for campaigns, profiles, and redemptions  
- 📋 **Comprehensive Documentation**: Detailed guides with real-world examples and best practices
- ⚙️ **Advanced Configuration**: Support for custom interceptors, base URLs, and converter factories
- 🛠️ **Production-Ready Examples**: Complete integration patterns for various architectural approaches

---

## 1. Installation and Setup

### 1.1. Add Configuration File

Place your `buzzebees-service.json` file in the `app/` directory of your Android project. This file
contains essential configuration for connecting to Buzzebees services.

```
app/
├── buzzebees-service.json  ← Place here
├── build.gradle.kts
└── src/
```

### 1.2. Configure Project-Level Settings

In your **project root `settings.gradle.kts`**, add the necessary repositories:

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
        gradlePluginPortal()
        // Add your private Buzzebees SDK Maven repository if applicable
        // maven { url = uri("https://your-buzzebees-sdk-repo.com/maven") }
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
        gradlePluginPortal()
        // Add your private Buzzebees SDK Maven repository if applicable
        // maven { url = uri("https://your-buzzebees-sdk-repo.com/maven") }
    }
}
```

### 1.3. Configure App-Level Build Script

In your **app-level `build.gradle.kts`**, apply the plugin and add dependencies:

```kotlin
plugins {
    // Your existing plugins...
    id("com.android.application")
    id("org.jetbrains.kotlin.android")

    // Apply the Buzzebees SDK services plugin (ONLY in app module)
    id("com.buzzebees.sdk.services") version "1.0.0"
}

dependencies {
    // Add Buzzebees SDK dependency
    implementation("com.buzzebees.sdk:buzzebees-sdk:1.0.0")

    // Your other dependencies...
}
```

> ⚠️ **Important:** The `com.buzzebees.sdk.services` plugin should ONLY be applied in the app module
> where `buzzebees-service.json` is located. Do not apply it in project-level build files.

## 2. Buzzebees API integration

| No.   | UseCase Name               | Guide Link                                          |
|-------|----------------------------|-----------------------------------------------------|
| 2.1   | Address UseCase            | [source](docs/readme/AddressUseCase_GUIDE.md)            |
| 2.2   | AddressInformation UseCase | [source](docs/readme/AddressInformationUseCase_GUIDE.md) |
| 2.3   | Auth UseCase               | [source](docs/readme/AuthUseCase_GUIDE.md)               |
| 2.3.1 | Auth Provider              | [source](docs/readme/auth_provider_guide.md)             |
| 2.4   | Badge UseCase              | [source](docs/readme/BadgeUseCase_GUIDE.md)              |
| 2.5   | Campaign UseCase           | [source](docs/readme/CampaignUseCase_GUIDE.md)           |
| 2.5.1 | Campaign Detail            | [source](docs/readme/CampaignDetail_GUIDE.md)            |
| 2.6   | Cart UseCase               | [source](docs/readme/CartUseCase_GUIDE.md)               |
| 2.7   | Category UseCase           | [source](docs/readme/CategoryUseCase_GUIDE.md)           |
| 2.8   | Consent UseCase            | [source](docs/readme/ConsentUseCase_GUIDE.md)            |
| 2.9   | Coupon UseCase             | [source](docs/readme/CouponUseCase_GUIDE.md)             |
| 2.10  | Dashboard UseCase          | [source](docs/readme/DashBoardUseCase_GUIDE.md)          |
| 2.11  | History UseCase            | [source](docs/readme/HistoryUseCase_GUIDE.md)            |
| 2.12  | Maintenance UseCase        | [source](docs/readme/MaintenanceUseCase_GUIDE.md)        |
| 2.13  | Notification UseCase       | [source](docs/readme/NotificationUseCase_GUIDE.md)       |
| 2.14  | Place UseCase              | [source](docs/readme/PlaceUseCase_GUIDE.md)              |
| 2.15  | PointLog UseCase           | [source](docs/readme/PointLogUseCase_GUIDE.md)           |
| 2.16  | Profile UseCase            | [source](docs/readme/ProfileUseCase_GUIDE.md)            |
| 2.17  | Register UseCase           | [source](docs/readme/RegisterUseCase_GUIDE.md)           |
| 2.18  | RequestHelp UseCase        | [source](docs/readme/RequestHelpUseCase_GUIDE.md)        |
| 2.19  | Stamp UseCase              | [source](docs/readme/StampUseCase_GUIDE.md)              |
| 2.20  | UserLevel UseCase          | [source](docs/readme/UserLevelUseCase_GUIDE.md)          |
| 2.21  | Wallet UseCase             | [source](docs/readme/WalletUseCase_GUIDE.md)             |
| 2.22  | ZipCode UseCase            | [source](docs/readme/ZipCodeUseCase_GUIDE.md)            |

### 2.23 Custom API Integration ⭐ **NEW**

The Buzzebees SDK now allows users to create custom API services while leveraging the SDK's pre-configured OkHttp and Retrofit setup, including authentication, interceptors, timeouts, and other optimizations.

| Component                    | Description                                                                                  | Guide Link                                     |
|------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------|
| **Custom API Integration**   | Complete guide for creating custom API services using SDK configuration                      | [source](docs/readme/CustomApiIntegration_GUIDE.md) |
| **URL Builder Extensions**   | Guide for using BuzzebeesSDK URL building capabilities for campaigns and profile images     | [source](docs/readme/UrlExtensions_GUIDE.md)        |

#### Quick Start - Custom API

```kotlin
// 1. Simple custom API service creation
interface WeatherApi {
    @GET("weather/current")
    suspend fun getCurrentWeather(@Query("city") city: String): WeatherResponse
}

val weatherApi = BuzzebeesSDK.instance().createCustomApiService(WeatherApi::class.java)

// 2. Advanced custom API with different base URL
val paymentApi = BuzzebeesSDK.instance().customApiBuilder()
    .baseUrl("https://payment-gateway.com/api/v1/")
    .addInterceptor(ApiKeyInterceptor("your-api-key"))
    .build(PaymentApi::class.java)
```

### 2.24 Image Loading with Authentication ⭐ **NEW**

The Buzzebees SDK provides `BuzzebeesSDKImageHeaders` for automatic authentication when loading images from Buzzebees API. Supports popular image loading libraries and manual loading.

| Component                    | Description                                                                                  | Guide Link                                     |
|------------------------------|----------------------------------------------------------------------------------------------|-----------------------------------------------|
| **Image Loading Guide**      | Complete guide for loading Buzzebees images with authentication using Coil, Glide, Picasso | [source](docs/readme/IMAGE_LOADING_GUIDE.md) |

#### Quick Start - Image Loading

```kotlin
// 1. With Coil (Setup once in Application class)
class MyApplication : Application(), ImageLoaderFactory {
    override fun newImageLoader(): ImageLoader {
        return ImageLoader.Builder(this)
            .okHttpClient {
                OkHttpClient.Builder()
                    .addInterceptor(BuzzebeesSDKImageHeaders.createInterceptor())
                    .build()
            }
            .build()
    }
}

// Usage
val profileUrl = BuzzebeesSDK.instance().buildProfileImageUrl("BZD_00001280200")
imageView.load(profileUrl)

// 2. Without external library
val client = OkHttpClient.Builder()
    .addInterceptor(BuzzebeesSDKImageHeaders.createInterceptor())
    .build()
// Use with your custom image loading solution
```

### 2.25 Error Handling System

The Buzzebees SDK includes comprehensive error handling documentation to help developers create
production-ready applications with excellent user experience.

| Component                        | Description                                                                                                              | Guide Link                                        |
|----------------------------------|--------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| **Error Handler Implementation** | Complete guide for implementing centralized error handling system with ErrorAction sealed class and SDKErrorHandler      | [source](docs/readme/ErrorHandlerGuide.md)             |
| **Error Handling Summary**       | Overview of all error handling tables added to UseCase guides, including error codes, scenarios, and recommended actions | [source](docs/readme/ERROR_HANDLING_UPDATE_SUMMARY.md) |

#### Key Features:

- **Centralized Error Management**: Single `SDKErrorHandler` class handles all SDK errors
- **Production-Ready Dialogs**: Pre-built dialog implementations with proper user messaging
- **Comprehensive Coverage**: Error handling for Auth, Campaign, Profile, and Badge operations
- **User-Friendly Messages**: Clear English error messages with constructive next steps
- **Extensible Design**: Easy to add new error types and customize for your app
- **Best Practices**: Guidelines for proper error handling in production apps

#### Quick Start:

1. **Review Error Tables**: Check individual UseCase guides for specific error scenarios
2. **Implement Error Handler**: Use `ErrorHandlerGuide.md` to create your error handling system
3. **Handle API Errors**: Follow implementation examples in each UseCase guide
4. **Test Error Scenarios**: Ensure proper error handling for all edge cases
5. **Customize Messages**: Adapt error messages and actions for your app's requirements

#### Error Types Covered:

- **Authentication Errors**: Login failures, account issues, OTP problems
- **Campaign Errors**: Redemption limits, expired campaigns, payment issues
- **Profile Errors**: Invalid data, duplicate information, image problems
- **Badge Errors**: Permission issues, missing conditions
- **Network Errors**: Connectivity issues, server problems, timeouts

## 3. Badge Management Integration

The Buzzebees SDK provides `BadgeManager` for receiving **real-time badge updates**. Proper **registration** and **unregistration** of badge listeners according to UI component lifecycles is crucial for optimal performance and preventing memory leaks.

The SDK includes `observeBadgeUpdates` extension functions to simplify lifecycle management across different components.

### 3.1. Activity Integration

Use `observeBadgeUpdates` directly with Activities. The listener automatically registers on
`ON_RESUME` and unregisters on `ON_PAUSE`.

```kotlin
import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.buzzebees.sdk.BuzzebeesSDK
import com.buzzebees.sdk.badge.extensions.observeBadgeUpdates
import com.buzzebees.sdk.badge.BadgeTraceModel
import com.buzzebees.sdk.badge.BadgeTraceModel

class MainActivity : AppCompatActivity() {

    private lateinit var badgeTextView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        badgeTextView = findViewById(R.id.badge_text_view)

        // Observe badge updates with automatic lifecycle management
        val badgeManager = BuzzebeesSDK.instance().badgeManager
        this.observeBadgeUpdates(badgeManager) { badgeModel ->
            runOnUiThread {
                badgeTextView.text = "Badge Count: ${badgeModel.count}"
            }
        }
    }
}
```

### 3.2. Fragment Integration

Use `viewLifecycleOwner` to bind badge updates to the fragment's view lifecycle, ensuring proper
cleanup when the view is destroyed.

```kotlin
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.buzzebees.sdk.BuzzebeesSDK
import com.buzzebees.sdk.badge.extensions.observeBadgeUpdates

class HomeFragment : Fragment() {

    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Use viewLifecycleOwner for proper lifecycle management
        val badgeManager = BuzzebeesSDK.instance().badgeManager
        viewLifecycleOwner.observeBadgeUpdates(badgeManager) { badgeModel ->
            binding.fragmentBadgeTextView.text = "Fragment Badge: ${badgeModel.count}"
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

### 3.3. Jetpack Compose Integration

For Jetpack Compose, use `DisposableEffect` to manage the listener lifecycle according to the
composable's lifecycle.

```kotlin
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import com.buzzebees.sdk.BuzzebeesSDK
import com.buzzebees.sdk.badge.BadgeListener
import com.buzzebees.sdk.badge.BadgeTraceModel
import com.buzzebees.sdk.badge.BadgeTraceModel

@Composable
fun BadgeDisplayScreen() {
    val badgeManager = remember { BuzzebeesSDK.instance().badgeManager }
    var badgeCount by remember { mutableIntStateOf(0) }
    val lifecycleOwner = LocalLifecycleOwner.current

    DisposableEffect(lifecycleOwner, badgeManager) {
        val listener = object : BadgeListener {
            override fun onBadgeReceived(badgeModel: BadgeTraceModel) {
                badgeCount = badgeModel.count
            }
        }

        val observer = LifecycleEventObserver { _, event ->
            when (event) {
                Lifecycle.Event.ON_RESUME -> badgeManager.registerBadgeListener(listener)
                Lifecycle.Event.ON_PAUSE -> badgeManager.unregisterBadgeListener(listener)
                else -> {}
            }
        }

        lifecycleOwner.lifecycle.addObserver(observer)

        onDispose {
            lifecycleOwner.lifecycle.removeObserver(observer)
            badgeManager.unregisterBadgeListener(listener)
        }
    }

    Text(text = "Current Badge: $badgeCount")
}
```

### 3.4. ViewModel Integration (MVVM Pattern)

In MVVM architecture, ViewModels are ideal for managing badge listener lifecycles as they survive
configuration changes and can share data across multiple views.

```kotlin
import androidx.lifecycle.*
import com.buzzebees.sdk.BuzzebeesSDK
import com.buzzebees.sdk.badge.BadgeListener
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class BadgeViewModel : ViewModel() {

    private val badgeManager = BuzzebeesSDK.instance().badgeManager

    // LiveData for traditional Android Views
    private val _badgeCountLiveData = MutableLiveData<Int>(0)
    val badgeCountLiveData: LiveData<Int> = _badgeCountLiveData

    // StateFlow for Jetpack Compose
    private val _badgeCountStateFlow = MutableStateFlow(0)
    val badgeCountStateFlow: StateFlow<Int> = _badgeCountStateFlow.asStateFlow()

    private val badgeListener = object : BadgeListener {
        override fun onBadgeReceived(badgeModel: BadgeTraceModel) {
            _badgeCountLiveData.postValue(badgeModel.count)
            _badgeCountStateFlow.value = badgeModel.count
        }
    }

    init {
        // Register listener when ViewModel is created
        badgeManager.registerBadgeListener(badgeListener)
    }

    override fun onCleared() {
        super.onCleared()
        // Unregister listener when ViewModel is destroyed
        badgeManager.unregisterBadgeListener(badgeListener)
    }

    // Optional: Manual refresh method
    fun refreshBadgeCount() {
        badgeManager.refreshBadgeCount()
    }
}
```

#### Using ViewModel with Traditional Views

```kotlin
class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var viewModel: BadgeViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        viewModel = ViewModelProvider(this)[BadgeViewModel::class.java]

        // Observe badge updates
        viewModel.badgeCountLiveData.observe(this) { badgeCount ->
            binding.badgeTextView.text = "Badge Count: $badgeCount"
        }
    }
}
```

#### Using ViewModel with Jetpack Compose

```kotlin
@Composable
fun BadgeScreen(
    viewModel: BadgeViewModel = viewModel()
) {
    val badgeCount by viewModel.badgeCountStateFlow.collectAsState()

    Column {
        Text(text = "Current Badge Count: $badgeCount")

        Button(
            onClick = { viewModel.refreshBadgeCount() }
        ) {
            Text("Refresh Badge")
        }
    }
}
```

### 3.5. Logic Query data for make sure you not missing any data

```kotlin
// Querying badge data directly from the BadgeManager
lifecycleScope.launch {
    BuzzebeesSDK.instance().badgeManager.getBadgeModelFlow()
        .collect { badgeModel ->
            badgeModel?.let {
                // ใช้งาน badgeModel ที่ได้
                Log.d("Badge", "Current badge: ${it.appPoint}")
            } ?: run {
                Log.d("Badge", "No badge data found")
            }
        }
}

// Clear badge data if needed
lifecycleScope.launch {
    BuzzebeesSDK.instance().badgeManager.clearBadge()
    Log.d("Badge", "Badge data cleared")
}
```

---

## 4. Best Practices

### Lifecycle Management

- Always pair `registerBadgeListener()` with `unregisterBadgeListener()`
- Use appropriate lifecycle owners (`viewLifecycleOwner` for Fragments, `this` for Activities)
- In ViewModels, register in `init{}` and unregister in `onCleared()`

### Threading Considerations

- Badge updates may come from background threads
- Use `runOnUiThread{}` in Activities or post values to LiveData/StateFlow in ViewModels
- In Compose, state updates automatically trigger recomposition on the main thread

### Memory Management

- Avoid strong references to Activities/Fragments in long-lived objects
- Use WeakReference if you must hold references to UI components
- Always clean up listeners in appropriate lifecycle callbacks

---

## 5. Summary

The Buzzebees SDK provides comprehensive badge management integration across all major Android
architectural patterns:

- **Activities**: Direct integration with automatic lifecycle management
- **Fragments**: View lifecycle-aware integration preventing memory leaks
- **Jetpack Compose**: Composable lifecycle integration with DisposableEffect
- **ViewModel (MVVM)**: Centralized badge management surviving configuration changes

Each approach ensures proper resource management and optimal performance while providing real-time
badge updates to your application's UI.

---

## Documentation Navigation

📖 **Detailed Guides**: All detailed guides are located in the [`docs/readme/`](docs/readme/) directory  
🔍 **Quick Reference**: Check the [SDK Comprehensive Guide](docs/readme/SDK_COMPREHENSIVE_GUIDE.md) for complete SDK overview  
⚙️ **Advanced Features**: See [Custom API Integration](docs/readme/CustomApiIntegration_GUIDE.md) for leveraging SDK infrastructure  
🛠️ **Error Handling**: Review [Error Handler Guide](docs/readme/ErrorHandlerGuide.md) for production-ready error management  

For more information and support, visit our documentation website or contact the Buzzebees development team.