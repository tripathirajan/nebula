import { Avatar, AvatarFallback } from '@nebula-lab/react-ui/avatar';
import { Button } from '@nebula-lab/react-ui/button';
import { Card } from '@nebula-lab/react-ui/card';
import { Separator } from '@nebula-lab/react-ui/separator';
import { Text } from '@nebula-lab/react-ui/text';
import { ThemeSwitcher } from '@nebula-lab/react-ui/theme-switcher';

export function Profile() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card className="flex flex-col items-center gap-2 p-6 text-center">
        <Avatar className="h-16 w-16">
          <AvatarFallback>J</AvatarFallback>
        </Avatar>
        <Text className="text-lg font-semibold">Jayvion Simon</Text>
        <Text className="text-sm opacity-70">jayvion@example.com</Text>
      </Card>

      <Card className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <Text className="text-sm font-medium">Appearance</Text>
          <ThemeSwitcher />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <Text className="text-sm font-medium">Notifications</Text>
          <Text className="text-xs opacity-60">On</Text>
        </div>
      </Card>

      <Button variant="ghost" color="danger">
        Sign out
      </Button>
    </div>
  );
}
