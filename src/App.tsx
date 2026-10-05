import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileShell } from './components/layout/MobileShell';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { VocabularyScreen } from './screens/VocabularyScreen';
import { AddWordModal } from './screens/AddWordModal';
import { FlashcardScreen } from './screens/FlashcardScreen';
import { GamesScreen } from './screens/GamesScreen';
import { MatchingGame } from './screens/games/MatchingGame';
import { AnagramGame } from './screens/games/AnagramGame';
import { QuizSprintGame } from './screens/games/QuizSprintGame';
import { AudioGame } from './screens/games/AudioGame';
import { TestSelectScreen } from './screens/test/TestSelectScreen';
import { TestRunScreen } from './screens/test/TestRunScreen';
import { TestResultsScreen } from './screens/test/TestResultsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { MultiplayerScreen } from './screens/MultiplayerScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { PremiumScreen } from './screens/PremiumScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { PrivacyPolicyScreen } from './screens/PrivacyPolicyScreen';
import { AdminScreen } from './screens/AdminScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { PronunciationScreen } from './screens/services/PronunciationScreen';
import { AudioPlayerScreen } from './screens/services/AudioPlayerScreen';
import { StoriesScreen } from './screens/services/StoriesScreen';
import { SentenceBuilderScreen } from './screens/services/SentenceBuilderScreen';
import { CertificateTestScreen } from './screens/services/CertificateTestScreen';
import { IeltsTestScreen } from './screens/services/IeltsTestScreen';
import { ExportToolsScreen } from './screens/services/ExportToolsScreen';
import { AiTutorScreen } from './screens/services/AiTutorScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { WeakWordsScreen } from './screens/WeakWordsScreen';

const MainNavigator: React.FC = () => {
  const { currentScreen } = useApp();

  switch (currentScreen) {
    case 'onboarding':
      return <OnboardingScreen />;

    case 'auth':
      return <AuthScreen />;

    case 'home':
      return <HomeScreen />;

    case 'vocabulary':
      return <VocabularyScreen />;

    case 'add_word':
      return <AddWordModal />;

    case 'flashcards':
      return <FlashcardScreen />;

    case 'games':
      return <GamesScreen />;

    case 'game_matching':
      return <MatchingGame />;

    case 'game_anagram':
      return <AnagramGame />;

    case 'game_sprint':
      return <QuizSprintGame />;

    case 'game_audio':
    case 'audio_game':
      return <AudioGame />;

    case 'test_select':
      return <TestSelectScreen />;

    case 'test_run':
      return <TestRunScreen />;

    case 'test_results':
      return <TestResultsScreen />;

    case 'progress':
      return <ProgressScreen />;

    case 'profile':
      return <ProfileScreen />;

    case 'multiplayer':
      return <MultiplayerScreen />;

    case 'notifications':
      return <NotificationsScreen />;

    case 'premium':
      return <PremiumScreen />;

    case 'settings':
      return <SettingsScreen />;

    case 'privacy_policy':
      return <PrivacyPolicyScreen />;

    case 'admin':
      return <AdminScreen />;

    case 'services':
      return <ServicesScreen />;

    case 'pronunciation':
      return <PronunciationScreen />;

    case 'audio_player':
      return <AudioPlayerScreen />;

    case 'stories':
      return <StoriesScreen />;

    case 'sentence_builder':
      return <SentenceBuilderScreen />;

    case 'certificate_test':
    case 'cefr_diagnostic':
      return <CertificateTestScreen />;

    case 'ielts_test':
      return <IeltsTestScreen />;

    case 'export_tools':
      return <ExportToolsScreen />;

    case 'ai_tutor':
      return <AiTutorScreen />;

    case 'leaderboard':
      return <LeaderboardScreen />;

    case 'weak_words':
      return <WeakWordsScreen />;

    default:
      return <HomeScreen />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <MobileShell>
        <MainNavigator />
      </MobileShell>
    </AppProvider>
  );
}
