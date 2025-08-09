import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, theme, Empty } from 'antd';
import { router } from './router';

const queryClient = new QueryClient();

// Catppuccin Mocha color palette
const catppuccinColors = {
  rosewater: '#f5e0dc',
  flamingo: '#f2cdcd',
  pink: '#f5c2e7',
  mauve: '#cba6f7',
  red: '#f38ba8',
  maroon: '#eba0ac',
  peach: '#fab387',
  yellow: '#f9e2af',
  green: '#a6e3a1',
  teal: '#94e2d5',
  sky: '#89dceb',
  sapphire: '#74c7ec',
  blue: '#89b4fa',
  lavender: '#b4befe',
  text: '#cdd6f4',
  subtext1: '#bac2de',
  subtext0: '#a6adc8',
  overlay2: '#9399b2',
  overlay1: '#7f849c',
  overlay0: '#6c7086',
  surface2: '#585b70',
  surface1: '#45475a',
  surface0: '#313244',
  base: '#1e1e2e',
  mantle: '#181825',
  crust: '#11111b',
};

const configTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    // Primary colors
    colorPrimary: catppuccinColors.mauve,
    colorSuccess: catppuccinColors.green,
    colorWarning: catppuccinColors.yellow,
    colorError: catppuccinColors.red,
    colorInfo: catppuccinColors.blue,

    // Background colors
    colorBgBase: catppuccinColors.base,
    colorBgContainer: catppuccinColors.surface0,
    colorBgElevated: catppuccinColors.surface1,
    colorBgLayout: catppuccinColors.mantle,
    colorBgSpotlight: catppuccinColors.surface2,

    // Text colors
    colorText: catppuccinColors.text,
    colorTextSecondary: catppuccinColors.subtext1,
    colorTextTertiary: catppuccinColors.subtext0,
    colorTextQuaternary: catppuccinColors.overlay2,

    // Border colors
    colorBorder: catppuccinColors.surface2,
    colorBorderSecondary: catppuccinColors.surface1,

    // Component specific
    colorFillAlter: catppuccinColors.surface0,
    colorFillContent: catppuccinColors.surface1,
    colorFillContentHover: catppuccinColors.surface2,
    colorFillSecondary: catppuccinColors.surface1,

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Font
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: catppuccinColors.crust,
      headerColor: catppuccinColors.text,
      footerBg: catppuccinColors.mantle,
      siderBg: catppuccinColors.surface0,
    },
    Menu: {
      darkItemBg: catppuccinColors.crust,
      darkItemColor: catppuccinColors.text,
      darkItemHoverBg: catppuccinColors.surface0,
      darkItemSelectedBg: catppuccinColors.mauve,
      darkItemSelectedColor: catppuccinColors.crust,
    },
    Button: {
      primaryShadow: `0 2px 0 ${catppuccinColors.surface2}`,
    },
    Card: {
      headerBg: catppuccinColors.surface1,
    },
  },
} as const;

export function Providers() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={configTheme}
        renderEmpty={() => (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Data" />
        )}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default Providers;