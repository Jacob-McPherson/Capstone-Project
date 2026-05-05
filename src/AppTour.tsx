import { Joyride } from 'react-joyride';
import type { Step } from 'react-joyride';
interface AppTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function AppTour({ run, onFinish }: AppTourProps) {
  const steps: Step[] = [
    {
      target: 'body',
      placement: 'center',
      title: 'Welcome to Blueprint!',
      content: 'Let\'s take a quick look around your new workspace. Blueprint turns your daily tasks into an RPG adventure.',
    },
    {
      target: '.tour-step-2',
      title: 'Create Quests',
      content: 'Here is where you forge new tasks. Give it a title, set a priority level, and assign a due date. Higher priority quests yield more XP.',
    },
    {
      target: '.tour-step-3',
      title: 'Track Your Progress',
      content: 'Your active quests live here. Use these tabs to quickly filter between what needs to be done, what you are working on, and what you\'ve conquered.',
    },
    {
      target: '.tour-step-4',
      title: 'Take Action',
      content: 'Click the circle to complete a quest, or the "Start" button to move it to In-Progress. Project Owners can use the 3-dots menu to edit or delete.',
    },
    {
      target: '.tour-step-5',
      title: 'Upcoming Deadlines',
      content: 'Keep an eye on your schedule. Dates with active quests will be highlighted here so nothing slips through the cracks.',
    },
    {
      target: '.tour-step-6',
      title: 'Multiplayer Mode',
      content: 'You are currently viewing your Personal Quests. Click the "+" icon to create a shared Workspace and invite your team to collaborate.',
    },
    {
      target: '.tour-step-7',
      title: 'Time Blocking',
      content: 'Need to plan your week? Switch to the Calendar view to see your quests mapped out hour-by-hour on a full weekly grid.',
    },
    {
      target: '.tour-step-8',
      title: 'Level Up',
      content: 'As you complete quests, you earn XP. Click here to open your profile, view your stats, and watch your chosen Avatar evolve as you level up!',
    }
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      // @ts-ignore
      showProgress={true} 
      showSkipButton={true}
      disableOverlayClose={true}
      spotlightPadding={8}
      callback={(data: any) => { 
        const { status } = data;
        if (status === 'finished' || status === 'skipped') {
          onFinish();
        }
      }}
      locale={{
        last: 'Done',
        next: 'OK >',
        skip: 'Skip Tour',
      }}
      styles={{
        options: {
          arrowColor: '#1f2937', 
          backgroundColor: '#1f2937',
          textColor: '#f9fafb', 
          overlayColor: 'rgba(0, 0, 0, 0.6)',
          primaryColor: '#3b82f6', 
          zIndex: 1000,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          fontWeight: 'bold',
        },
        buttonBack: {
          color: '#9ca3af',
        }
      } as any} 
    />
  );
}