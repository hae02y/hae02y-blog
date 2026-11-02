import type { CommandDef } from './types';
import { siteConfig } from '@/config/site';
import { meConfig, type ResumeProject } from '@/config/me';

// ── ANSI helpers ──
const green = (s: string) => `\x1b[32m${s}\x1b[0m`;
const cyan = (s: string) => `\x1b[36m${s}\x1b[0m`;
const magenta = (s: string) => `\x1b[35m${s}\x1b[0m`;
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`;
const red = (s: string) => `\x1b[31m${s}\x1b[0m`;
const gray = (s: string) => `\x1b[90m${s}\x1b[0m`;
const brunchGreen = (s: string) => `\x1b[38;5;114m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;
const link = (url: string, label?: string) =>
  `\x1b]8;;${url}\x1b\\${label ?? url}\x1b]8;;\x1b\\`;

// ── Welcome banner ──
export const welcomeBanner: string[] = [
  '',
  cyan(' _                 ___  ___        '),
  cyan('| |__   __ _  ___ / _ \\|__ \\ _   _ '),
  cyan("| '_ \\ / _` |/ _ \\ | | | / /| | | |"),
  cyan('| | | | (_| |  __/ |_| |/ /_| |_| |'),
  cyan('|_| |_|\\__,_|\\___|\\___/|____|\\__, |'),
  cyan('                              |___/  '),
  '',
  `  ${bold('hae02y')}${gray("'s terminal")}`,
  `  ${gray("Type '")}${cyan('help')}${gray("' for available commands.")}`,
  '',
];

const terminalConfig = siteConfig.terminal;
const commandMeta = new Map(terminalConfig.commands.map((command) => [command.name, command]));
const getCommandMeta = (name: string) => {
  const meta = commandMeta.get(name);
  if (!meta) throw new Error(`Missing terminal command config: ${name}`);
  return meta;
};
const commandDescription = (name: string) => getCommandMeta(name).description;
const resume = meConfig.resume;
const resumeLinkByIcon = new Map(resume.links.map((item) => [item.icon, item]));

const getProjectBullets = (project: ResumeProject): string[] => {
  if (project.bullets?.length) return project.bullets;
  return project.bulletGroups?.flatMap((group) => group.bullets) ?? [];
};

const allResumeProjects = [...resume.projects, ...resume.automation];
const portfolioProjects = [
  ...meConfig.portfolio.companies.flatMap((company) => company.projects),
  ...meConfig.portfolio.solo,
];

const collectTechNames = () => {
  const counts = new Map<string, number>();
  const stacks = [
    ...allResumeProjects.map((project) => project.techStack),
    ...portfolioProjects.map((project) => project.techStack),
  ].filter(Boolean);

  for (const stack of stacks) {
    for (const tech of stack.split(',').map((item) => item.trim()).filter(Boolean)) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([tech]) => tech);
};

const pickTechs = (source: string[], preferred: string[], limit: number) => preferred.filter((tech) => source.includes(tech)).slice(0, limit);

// ── Command definitions ──

const helpCmd: CommandDef = {
  name: 'help',
  description: commandDescription('help'),
  handler: (_args, _ctx) => {
    const usageWidth = Math.max(...terminalConfig.commands.map((command) => command.usage.length));
    const lines = [
      gray('────────────────────────────────────────'),
      bold(terminalConfig.helpTitle),
      '',
    ];

    terminalConfig.helpGroups.forEach((group, groupIndex) => {
      if (groupIndex > 0) lines.push('');
      group.forEach((name) => {
        const meta = getCommandMeta(name);
        lines.push(`  ${cyan(meta.usage.padEnd(usageWidth))}   ${meta.description}`);
      });
    });

    lines.push(gray('────────────────────────────────────────'));
    return { lines };
  },
};

const helloCmd: CommandDef = {
  name: 'hello',
  description: commandDescription('hello'),
  handler: (_args, ctx) => ({
    lines: [green(`✅ Hello, ${ctx.title}!`)],
  }),
};

const clearCmd: CommandDef = {
  name: 'clear',
  description: commandDescription('clear'),
  handler: (_args, ctx) => {
    ctx.term.clear();
  },
};

const gitCmd: CommandDef = {
  name: 'git',
  description: commandDescription('git'),
  handler: () => ({
    lines: [cyan(`🌐 GitHub: ${link('https://github.com/hae02y')}`)],
  }),
};

const blogCmd: CommandDef = {
  name: 'blog',
  description: commandDescription('blog'),
  handler: () => ({
    lines: [magenta(`TECH: ${link('https://blog.hae02y.me/blog/', '/blog/')}`)],
  }),
};

const insightCmd: CommandDef = {
  name: 'insight',
  description: commandDescription('insight'),
  handler: () => ({
    lines: [yellow(`ESSAY: ${link('https://blog.hae02y.me/Insight/', '/Insight/')}`)],
  }),
};

const brunchCmd: CommandDef = {
  name: 'brunch',
  description: commandDescription('brunch'),
  handler: () => ({
    lines: [brunchGreen(`✍️  Brunch: ${link(siteConfig.links.brunch, 'brunch.co.kr/@hae02y')}`)],
  }),
};

const labCmd: CommandDef = {
  name: 'lab',
  description: commandDescription('lab'),
  handler: () => ({
    lines: [green(`🧪 Vibe Coding Lab: ${link('https://ground.hae02y.me/', 'ground.hae02y.me')}`)],
  }),
};

const appsCmd: CommandDef = {
  name: 'apps',
  description: commandDescription('apps'),
  handler: (_args, ctx) => {
    ctx.term.writeln(green('  Opening apps...'));
    setTimeout(() => ctx.navigate('/apps/'), 300);
  },
};

// ── New: Info commands ──

const whoamiCmd: CommandDef = {
  name: 'whoami',
  description: commandDescription('whoami'),
  handler: () => {
    const currentRole = resume.experiences[0]?.role ?? 'Backend Developer';
    const github = resumeLinkByIcon.get('github');
    const blog = resumeLinkByIcon.get('blog');
    const lines = [
      '',
      gray('  ┌─ profile'),
      `  │ ${bold('hae02y')} ${gray('/')} ${cyan(meConfig.profile.name)}`,
      gray('  │'),
      `  │ ${gray('role')}    ${currentRole}`,
      `  │ ${gray('focus')}   backend systems · infra · practical AI`,
      `  │ ${gray('mail')}    ${cyan(meConfig.profile.email)}`,
      `  │ ${gray('github')}  ${cyan(link(github?.url ?? 'https://github.com/hae02y', 'github.com/hae02y'))}`,
      `  │ ${gray('site')}    ${cyan(link(blog?.url ?? 'https://blog.hae02y.me', 'blog.hae02y.me'))}`,
      `  │ ${gray('brunch')}  ${brunchGreen(link(siteConfig.links.brunch, 'brunch.co.kr/@hae02y'))}`,
      gray('  └─ ' + meConfig.profile.summary[0]),
      gray('     ' + meConfig.profile.summary[1]),
      '',
    ];
    return { lines, animate: true };
  },
};

const skillsCmd: CommandDef = {
  name: 'skills',
  description: commandDescription('skills'),
  handler: () => {
    const techs = collectTechNames();
    const categories = [
      ['Backend', pickTechs(techs, ['Java', 'Kotlin', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis', 'QueryDSL', 'FastAPI'], 8)],
      ['Infra', pickTechs(techs, ['AWS', 'NCP', 'Kubernetes', 'Docker', 'Nginx', 'Traefik', 'Jenkins', 'GitHub Actions', 'Bitbucket Pipeline'], 8)],
      ['Data', pickTechs(techs, ['MySQL', 'PostgreSQL', 'Redis', 'InfluxDB', 'MariaDB', 'MSSQL'], 6)],
      ['Frontend', pickTechs(techs, ['TypeScript', 'React', 'React.js', 'TailwindCSS', 'Thymeleaf', 'jQuery', 'Zustand', 'Redux'], 8)],
    ].filter(([, items]) => items.length > 0) as [string, string[]][];

    return {
      lines: [
        '',
        gray('  ┌─ skills from /about resume'),
        ...categories.map(([label, items]) => `  │ ${yellow(label.padEnd(8))} ${items.join(', ')}`),
        gray('  └─ source: src/config/me.ts'),
        '',
      ],
      animate: true,
    };
  },
};

const experienceCmd: CommandDef = {
  name: 'experience',
  description: commandDescription('experience'),
  handler: () => {
    const lines = ['', gray('  ┌─ experience from /about')];

    resume.experiences.forEach((exp, index) => {
      if (index > 0) lines.push(gray('  │'));
      lines.push(`  │ ${bold(exp.company)} ${gray(`(${exp.period})`)}`);
      lines.push(`  │ ${cyan(exp.role)}`);
      if (exp.description) lines.push(`  │ ${gray(exp.description.trim())}`);
    });

    lines.push(gray('  └─ type `projects` for work highlights'), '');
    return { lines, animate: true };
  },
};

const projectsCmd: CommandDef = {
  name: 'projects',
  description: commandDescription('projects'),
  handler: () => {
    const lines = ['', gray('  ┌─ selected portfolio from /about')];

    allResumeProjects.slice(0, 6).forEach((project, index) => {
      const firstBullet = getProjectBullets(project)[0];
      if (index > 0) lines.push(gray('  │'));
      lines.push(`  │ ${cyan('▸')} ${bold(project.title)}`);
      lines.push(`  │   ${gray(`${project.org} · ${project.period}`)}`);
      if (project.techStack) lines.push(`  │   ${yellow(project.techStack)}`);
      if (firstBullet) lines.push(`  │   ${firstBullet}`);
    });

    lines.push(gray('  └─ More at ') + cyan(link('https://blog.hae02y.me/about/', '/about/')), '');
    return { lines, animate: true };
  },
};

// ── New: Navigation commands ──

const cdCmd: CommandDef = {
  name: 'cd',
  description: commandDescription('cd'),
  handler: (args, ctx) => {
    const target = args[0]?.toLowerCase();
    if (!target) {
      const available = Object.keys(terminalConfig.paths).join(', ');
      return { lines: [yellow(`Usage: cd <${available}>`)] };
    }
    const path = terminalConfig.paths[target as keyof typeof terminalConfig.paths];
    if (!path) {
      const available = Object.keys(terminalConfig.paths).join(', ');
      return {
        lines: [
          red(`❌ Unknown path: ${target}`),
          gray(`  Available: ${available}`),
        ],
      };
    }
    ctx.term.writeln(green(`  Navigating to ${path}...`));
    setTimeout(() => ctx.navigate(path), 300);
  },
};

const openCmd: CommandDef = {
  name: 'open',
  description: commandDescription('open'),
  handler: (args, ctx) => {
    const url = args[0];
    if (!url) {
      return { lines: [yellow('Usage: open <url>')] };
    }
    if (!/^https?:\/\//i.test(url)) {
      return { lines: [red('❌ URL must start with http:// or https://')] };
    }
    ctx.openExternal(url);
    return { lines: [green(`  Opening ${url} in a new tab...`)] };
  },
};

// ── Registry ──

const allCommands: CommandDef[] = [
  helpCmd,
  helloCmd,
  clearCmd,
  gitCmd,
  blogCmd,
  insightCmd,
  brunchCmd,
  labCmd,
  appsCmd,
  whoamiCmd,
  skillsCmd,
  experienceCmd,
  projectsCmd,
  cdCmd,
  openCmd,
];

export const commandRegistry = new Map<string, CommandDef>(
  allCommands.map((cmd) => [cmd.name, cmd]),
);

export const commandNames = allCommands.map((cmd) => cmd.name);
