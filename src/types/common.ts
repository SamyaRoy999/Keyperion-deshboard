export interface childrenProps {
  children: React.ReactNode;
}

export type IdParams = {
  params: Promise<{ id: string }>;
};

export type SlugParams = {
  params: Promise<{ slug: string }>;
};


export interface Args {
  id?: any;
  arg?: Record<string, any>;
}
