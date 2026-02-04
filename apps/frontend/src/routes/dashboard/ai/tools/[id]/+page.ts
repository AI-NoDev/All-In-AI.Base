import type { PageLoad } from './$types';

export const _meta = {
  title: '编辑工具',
  icon: 'mdi:tools',
  group: '智能体',
  hidden: true,
};

export const load: PageLoad = ({ params }) => {
  return { id: params.id };
};
