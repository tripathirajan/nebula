import { Heading } from '@nebula-lab/react-ui/heading';
import { Text } from '@nebula-lab/react-ui/text';
import { TeamMemberCard } from '@nebula-lab/react-ui-blocks/dashboard';

const members = [
  { name: 'Jayvion Simon', jobTitle: 'UI Designer', avatarFallback: 'J', stats: [{ label: 'Projects', value: 24 }, { label: 'Tasks', value: 128 }] },
  { name: 'Lucian Obrien', jobTitle: 'Product Manager', avatarFallback: 'L', stats: [{ label: 'Projects', value: 12 }, { label: 'Tasks', value: 76 }] },
  { name: 'Deja Brady', jobTitle: 'Frontend Engineer', avatarFallback: 'D', stats: [{ label: 'Projects', value: 31 }, { label: 'Tasks', value: 204 }] },
  { name: 'Harrison Stein', jobTitle: 'Backend Engineer', avatarFallback: 'H', stats: [{ label: 'Projects', value: 18 }, { label: 'Tasks', value: 95 }] },
  { name: 'Reece Chung', jobTitle: 'QA Engineer', avatarFallback: 'R', stats: [{ label: 'Projects', value: 9 }, { label: 'Tasks', value: 54 }] },
  { name: 'Lainey Davidson', jobTitle: 'DevOps Engineer', avatarFallback: 'L', stats: [{ label: 'Projects', value: 15 }, { label: 'Tasks', value: 61 }] },
];

export function Team() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading as="h2" level={3}>
          Team
        </Heading>
        <Text className="mt-1 opacity-70">Everyone with access to this workspace.</Text>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <TeamMemberCard key={member.name} {...member} />
        ))}
      </div>
    </div>
  );
}
