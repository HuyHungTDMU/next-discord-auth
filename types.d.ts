interface User {
  id: string;
  username: string;
  avatar: string;
  email: string;
  server: Server | undefined | null;
}

interface Server {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: [any];
  permissions_new: string;
  channels: [Channel];
}

interface Channel {
  id: string;
  last_message_id: string;
  type: number;
  name: string;
  position: number;
  flags: number;
  parent_id: string;
  topic: string;
  guild_id: string;
  permission_overwrites: [any];
  rate_limit_per_user: number;
  nsfw: boolean;
}
