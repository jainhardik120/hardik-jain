'use client';

import React, { useState } from 'react';

import Head from 'next/head';

import { Info, Type, Eye, UploadCloud } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import type { Property } from 'csstype';

type ColorPalette = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  muted: string;
};

enum ColorPalettes {
  default = 'default',
  dark = 'dark',
  warm = 'warm',
  cool = 'cool',
  forest = 'forest',
}

const colorPalettes: {
  [key in ColorPalettes]: ColorPalette;
} = {
  default: {
    primary: '#000000',
    secondary: '#6b7280',
    accent: '#3b82f6',
    background: '#ffffff',
    muted: '#f3f4f6',
  },
  dark: {
    primary: '#ffffff',
    secondary: '#9ca3af',
    accent: '#3b82f6',
    background: '#1f2937',
    muted: '#374151',
  },
  warm: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#d97706',
    background: '#fffbeb',
    muted: '#fef3c7',
  },
  cool: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#0ea5e9',
    background: '#f0f9ff',
    muted: '#e0f2fe',
  },
  forest: {
    primary: '#1f2937',
    secondary: '#6b7280',
    accent: '#059669',
    background: '#ecfdf5',
    muted: '#d1fae5',
  },
};

export default function TypographyToolsPage() {
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [fontWeight, setFontWeight] = useState('normal');
  const [sampleText, setSampleText] = useState('The quick brown fox jumps over the lazy dog');
  const [selectedColorPalette, setSelectedColorPalette] = useState<ColorPalettes>(
    ColorPalettes.default,
  );
  const [fontContrast, setFontContrast] = useState(1);
  const [customFontUrl, setCustomFontUrl] = useState('');
  const [customFontName, setCustomFontName] = useState('');
  const [textAlign, setTextAlign] = useState<Property.TextAlign>('left');
  const [textTransform, setTextTransform] = useState<Property.TextTransform>('none');
  const [wordSpacing, setWordSpacing] = useState(0);
  const [paragraphSpacing, setParagraphSpacing] = useState(1);

  const fonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather',
    'Source Serif Pro',
    'Lora',
    'Fira Sans',
  ];

  const fontWeights = [
    'thin',
    'extralight',
    'light',
    'normal',
    'medium',
    'semibold',
    'bold',
    'extrabold',
    'black',
  ];

  const activeColors = colorPalettes[selectedColorPalette];

  return (
    <div className="container mx-auto py-8 px-4">
      <Head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Open+Sans:wght@300;400;500;700&family=Montserrat:wght@300;400;500;700&family=Poppins:wght@300;400;500;700&family=Playfair+Display:wght@300;400;500;700&family=Merriweather:wght@300;400;500;700&family=Source+Serif+Pro:wght@300;400;500;700&family=Lora:wght@300;400;500;700&family=Fira+Sans:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <h1 className="text-3xl font-bold mb-6">Typography Tools</h1>
      <p className="text-gray-500 mb-8">
        A comprehensive set of tools to help you design and explore typography for your web
        projects.
      </p>

      <Tabs defaultValue="playground" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="scale">Type Scale</TabsTrigger>
          <TabsTrigger value="colors">Color Palettes</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="custom-fonts">Custom Fonts</TabsTrigger>
          <TabsTrigger value="text-animation">Text Effects</TabsTrigger>
        </TabsList>

        <TabsContent value="playground" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Typography Playground</CardTitle>
              <CardDescription>
                Select fonts, adjust sizes, and see live previews of your typography choices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="font-select">Font Family</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger id="font-select">
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fonts.map((font) => (
                          <SelectItem key={font} value={font}>
                            {font}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                    <Slider
                      id="font-size"
                      min={8}
                      max={32}
                      step={1}
                      value={[fontSize]}
                      onValueChange={(value) => setFontSize(value[0] ?? 0)}
                      className="my-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="line-height">Line Height: {lineHeight}</Label>
                    <Slider
                      id="line-height"
                      min={1}
                      max={2.5}
                      step={0.1}
                      value={[lineHeight]}
                      onValueChange={(value) => setLineHeight(value[0] ?? 0)}
                      className="my-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="letter-spacing">Letter Spacing: {letterSpacing}em</Label>
                    <Slider
                      id="letter-spacing"
                      min={-0.05}
                      max={0.1}
                      step={0.01}
                      value={[letterSpacing]}
                      onValueChange={(value) => setLetterSpacing(value[0] ?? 0)}
                      className="my-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="font-weight">Font Weight</Label>
                    <Select value={fontWeight} onValueChange={setFontWeight}>
                      <SelectTrigger id="font-weight">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontWeights.map((weight) => (
                          <SelectItem key={weight} value={weight}>
                            {weight}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sample-text">Sample Text</Label>
                    <Input
                      id="sample-text"
                      value={sampleText}
                      onChange={(e) => setSampleText(e.target.value)}
                      className="my-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="color-palette">Color Palette</Label>
                    <Select
                      value={selectedColorPalette}
                      onValueChange={(value) =>
                        setSelectedColorPalette(value as keyof typeof colorPalettes)
                      }
                    >
                      <SelectTrigger id="color-palette">
                        <SelectValue placeholder="Select color palette" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(colorPalettes).map((palette) => (
                          <SelectItem key={palette} value={palette}>
                            {palette.charAt(0).toUpperCase() + palette.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{
                    fontFamily: `${selectedFont}, sans-serif`,
                    fontSize: `${fontSize}px`,
                    lineHeight: lineHeight,
                    letterSpacing: `${letterSpacing}em`,
                    fontWeight: fontWeight,
                    color: activeColors.primary,
                    backgroundColor: activeColors.background,
                  }}
                >
                  <h1
                    style={{
                      fontSize: `${fontSize * 2.5}px`,
                      lineHeight: 1.2,
                      marginBottom: '1rem',
                      color: activeColors.primary,
                    }}
                  >
                    Heading 1
                  </h1>
                  <h2
                    style={{
                      fontSize: `${fontSize * 2}px`,
                      lineHeight: 1.2,
                      marginBottom: '0.75rem',
                      color: activeColors.primary,
                    }}
                  >
                    Heading 2
                  </h2>
                  <h3
                    style={{
                      fontSize: `${fontSize * 1.5}px`,
                      lineHeight: 1.3,
                      marginBottom: '0.5rem',
                      color: activeColors.primary,
                    }}
                  >
                    Heading 3
                  </h3>
                  <h4
                    style={{
                      fontSize: `${fontSize * 1.25}px`,
                      lineHeight: 1.4,
                      marginBottom: '0.5rem',
                      color: activeColors.primary,
                    }}
                  >
                    Heading 4
                  </h4>
                  <p style={{ marginBottom: '1rem', color: activeColors.primary }}>{sampleText}</p>
                  <p style={{ color: activeColors.secondary }}>
                    This is secondary text in the selected color palette.
                  </p>
                  <p>
                    <a href="#" style={{ color: activeColors.accent }}>
                      This is a link
                    </a>{' '}
                    in the accent color.
                  </p>
                  <p
                    style={{
                      color: activeColors.muted,
                      backgroundColor: activeColors.primary,
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                    }}
                  >
                    Inverted text on primary background
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="scale" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Type Scale</CardTitle>
              <CardDescription>
                Compare different type sizes and see how they relate to each other.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="space-y-8"
                style={{
                  fontFamily: `${selectedFont}, sans-serif`,
                  color: activeColors.primary,
                  backgroundColor: activeColors.background,
                  padding: '1rem',
                  borderRadius: '0.5rem',
                }}
              >
                {[
                  { size: 48, label: 'Display / 48px' },
                  { size: 36, label: 'H1 / 36px' },
                  { size: 30, label: 'H2 / 30px' },
                  { size: 24, label: 'H3 / 24px' },
                  { size: 20, label: 'H4 / 20px' },
                  { size: 18, label: 'H5 / 18px' },
                  { size: 16, label: 'Body / 16px' },
                  { size: 14, label: 'Small / 14px' },
                  { size: 12, label: 'Caption / 12px' },
                ].map((item) => (
                  <div key={item.size} className="flex items-center">
                    <div className="w-20 text-sm text-gray-500">{item.size}px</div>
                    <div
                      style={{
                        fontSize: `${item.size}px`,
                        lineHeight: lineHeight,
                        letterSpacing: `${letterSpacing}em`,
                        fontWeight: fontWeight,
                      }}
                    >
                      {item.label} — {sampleText}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="colors" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Color Palettes</CardTitle>
              <CardDescription>
                Explore different color combinations for your typography.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.entries(colorPalettes).map(([name, colors]) => (
                  <div key={name} className="space-y-2">
                    <h3 className="text-lg font-semibold capitalize">{name} Palette</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {Object.entries(colors).map(([colorName, hex]) => (
                        <div key={colorName} className="space-y-1">
                          <div
                            className="h-12 rounded-md border"
                            style={{ backgroundColor: hex }}
                          ></div>
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{colorName}</span>
                            <span className="text-gray-500">{hex}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className="p-4 rounded-lg mt-4"
                      style={{
                        fontFamily: `${selectedFont}, sans-serif`,
                        backgroundColor: colors.background,
                      }}
                    >
                      <h3
                        style={{
                          color: colors.primary,
                          fontSize: '1.5rem',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Sample Text
                      </h3>
                      <p style={{ color: colors.primary }}>
                        This is primary text in the {name} palette.
                      </p>
                      <p style={{ color: colors.secondary }}>
                        This is secondary text in the {name} palette.
                      </p>
                      <p>
                        <a href="#" style={{ color: colors.accent }}>
                          This is a link
                        </a>{' '}
                        in the accent color.
                      </p>
                      <div
                        style={{
                          backgroundColor: colors.muted,
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                          marginTop: '0.5rem',
                        }}
                      >
                        <p style={{ color: colors.primary }}>Text on muted background</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="accessibility" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Accessibility Tools</CardTitle>
              <CardDescription>
                Test your typography for accessibility and readability.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <Label htmlFor="contrast-checker">Contrast Checker</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            WCAG 2.1 AA requires a contrast ratio of at least 4.5:1 for normal text
                            and 3:1 for large text (18pt+ or 14pt+ bold).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Text color: {activeColors.primary}</span>
                        <span>Background: {activeColors.background}</span>
                      </div>
                      <div
                        className="p-4 rounded-lg"
                        style={{
                          color: activeColors.primary,
                          backgroundColor: activeColors.background,
                          fontFamily: `${selectedFont}, sans-serif`,
                          fontSize: `${fontSize}px`,
                        }}
                      >
                        Sample Text
                      </div>

                      {/* This is a simplified contrast estimate - real implementation would use proper calculations */}
                      <div className="flex items-center justify-between mt-2">
                        <span>Estimated contrast ratio:</span>
                        <span
                          className={`font-medium ${
                            Math.abs(
                              parseInt(activeColors.primary.slice(1), 16) -
                                parseInt(activeColors.background.slice(1), 16),
                            ) > 8000000
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {Math.abs(
                            parseInt(activeColors.primary.slice(1), 16) -
                              parseInt(activeColors.background.slice(1), 16),
                          ) > 8000000
                            ? '4.5:1+ (Passes AA)'
                            : 'Below 4.5:1 (Fails AA)'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Reading Mode Simulation</h4>
                      <div className="space-y-2">
                        <div>
                          <Label htmlFor="font-contrast">Font Weight Adjustment</Label>
                          <Slider
                            id="font-contrast"
                            min={0.5}
                            max={1.5}
                            step={0.1}
                            value={[fontContrast]}
                            onValueChange={(value) => setFontContrast(value[0] ?? 0)}
                            className="my-2"
                          />
                          <div className="text-sm text-gray-500">
                            {fontContrast < 1 ? 'Lighter' : fontContrast > 1 ? 'Bolder' : 'Normal'}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => document.documentElement.classList.toggle('grayscale')}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Toggle Grayscale Mode
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Readability Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Characters per line</Label>
                      <div className="mt-1 text-sm">
                        {sampleText.length > 0 ? sampleText.length : 0} characters
                        <span
                          className={`ml-2 ${
                            sampleText.length >= 45 && sampleText.length <= 75
                              ? 'text-green-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {sampleText.length >= 45 && sampleText.length <= 75
                            ? '(Optimal)'
                            : sampleText.length < 45
                              ? '(Too short for optimal reading)'
                              : '(Too long for optimal reading)'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Best practice: 45-75 characters per line for optimal readability.
                      </p>
                    </div>

                    <div>
                      <Label>Reading time estimate</Label>
                      <div className="mt-1">
                        <p className="text-sm">
                          ~{Math.max(1, Math.ceil(sampleText.split(' ').length / 200))} minute read
                          ({Math.ceil((sampleText.split(' ').length / 200) * 60)} seconds)
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Based on average reading speed of 200 words per minute.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom-fonts" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Custom Font Tools</CardTitle>
              <CardDescription>Test with custom fonts and variable fonts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Add Custom Font</h3>
                    <div className="space-y-2">
                      <Label htmlFor="custom-font-url">Font URL (Google Fonts or other CDN)</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="custom-font-url"
                          placeholder="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
                          value={customFontUrl}
                          onChange={(e) => setCustomFontUrl(e.target.value)}
                        />
                        <Button variant="outline" size="icon">
                          <UploadCloud className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="custom-font-name">Font Name</Label>
                      <Input
                        id="custom-font-name"
                        placeholder="Roboto"
                        value={customFontName}
                        onChange={(e) => setCustomFontName(e.target.value)}
                      />
                    </div>

                    <Button
                      onClick={() => {
                        if (customFontName && customFontUrl) {
                          // In a real implementation, we would dynamically load the font
                          // For demo purposes, we'll just alert
                          alert(`Font ${customFontName} would be loaded from ${customFontUrl}`);
                        }
                      }}
                    >
                      Load Custom Font
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Variable Font Controls</h3>
                    <p className="text-sm text-gray-500">
                      Variable fonts allow granular control over font properties. These controls
                      work with variable fonts like Inter, Roboto Flex, or Source Sans Variable.
                    </p>

                    <div className="space-y-2">
                      <Label>Font Width (Variable fonts only)</Label>
                      <Slider min={75} max={125} step={1} value={[100]} className="my-2" />
                      <div className="text-sm text-gray-500">
                        This control only works with variable fonts that support width variation.
                      </div>
                    </div>

                    <div>
                      <Label>Font Optical Size (Variable fonts only)</Label>
                      <Slider min={8} max={72} step={1} value={[16]} className="my-2" />
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">
                          <Type className="mr-2 h-4 w-4" /> Load Sample Variable Font
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Load Variable Font Demo</AlertDialogTitle>
                          <AlertDialogDescription>
                            This feature would load a variable font like Inter or Roboto Flex for
                            demonstration. In a real implementation, this would dynamically load the
                            font and apply it to the preview.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">System Font Stack Generator</h3>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-500">
                      System fonts provide better performance by avoiding additional network
                      requests. Select options to generate a system font stack that resembles your
                      preferred font.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="justify-start">
                        Sans-serif System Fonts
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Serif System Fonts
                      </Button>
                      <Button variant="outline" className="justify-start">
                        Monospace System Fonts
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="text-animation" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Text Layout & Effects</CardTitle>
              <CardDescription>
                Explore additional text styling options and effects.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Text Layout Controls</h3>

                    <div>
                      <Label htmlFor="text-align">Text Alignment</Label>
                      <Select
                        value={textAlign}
                        onValueChange={(value) => setTextAlign(value as Property.TextAlign)}
                      >
                        <SelectTrigger id="text-align">
                          <SelectValue placeholder="Select alignment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="justify">Justify</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="text-transform">Text Transformation</Label>
                      <Select
                        value={textTransform}
                        onValueChange={(value) => setTextTransform(value as Property.TextTransform)}
                      >
                        <SelectTrigger id="text-transform">
                          <SelectValue placeholder="Select transformation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="uppercase">UPPERCASE</SelectItem>
                          <SelectItem value="lowercase">lowercase</SelectItem>
                          <SelectItem value="capitalize">Capitalize</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="word-spacing">Word Spacing: {wordSpacing}em</Label>
                      <Slider
                        id="word-spacing"
                        min={-0.05}
                        max={0.5}
                        step={0.05}
                        value={[wordSpacing]}
                        onValueChange={(value) => setWordSpacing(value[0] ?? 0)}
                        className="my-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="paragraph-spacing">
                        Paragraph Spacing: {paragraphSpacing}em
                      </Label>
                      <Slider
                        id="paragraph-spacing"
                        min={0.5}
                        max={3}
                        step={0.25}
                        value={[paragraphSpacing]}
                        onValueChange={(value) => setParagraphSpacing(value[0] ?? 0)}
                        className="my-2"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Text Effects</h3>

                    <div className="space-y-2">
                      <Label>Text Shadow</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="text-left justify-start h-auto py-2"
                          onClick={() => {
                            document
                              .getElementById('text-effect-preview')
                              ?.style?.setProperty('textShadow', 'none');
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span>None</span>
                            <span className="text-xs text-gray-500">No shadow</span>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left justify-start h-auto py-2"
                          onClick={() => {
                            document
                              .getElementById('text-effect-preview')
                              ?.style?.setProperty('textShadow', '1px 1px 2px rgba(0,0,0,0.3)');
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span>Subtle</span>
                            <span className="text-xs text-gray-500">Light shadow</span>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left justify-start h-auto py-2"
                          onClick={() => {
                            document
                              .getElementById('text-effect-preview')
                              ?.style?.setProperty('textShadow', '2px 2px 4px rgba(0,0,0,0.5)');
                          }}
                        >
                          <div className="flex flex-col items-start">
                            <span>Strong</span>
                            <span className="text-xs text-gray-500">Bold shadow</span>
                          </div>
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Decoration</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="text-left justify-start"
                          onClick={() => {
                            document
                              .getElementById('text-effect-preview')
                              ?.style?.setProperty('textDecoration', 'none');
                          }}
                        >
                          None
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left justify-start"
                          onClick={() => {
                            document
                              .getElementById('text-effect-preview')
                              ?.style?.setProperty('textDecoration', 'underline');
                          }}
                        >
                          Underline
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left justify-start"
                          onClick={() => {
                            document
                              .getElementById('text-effect-preview')
                              ?.style?.setProperty('textDecoration', 'line-through');
                          }}
                        >
                          Strikethrough
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Text Gradient (Modern Browsers)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          className="text-left justify-start"
                          onClick={() => {
                            const element = document.getElementById('text-effect-preview');
                            if (element === null) {
                              return;
                            }
                            element.style.background = 'linear-gradient(45deg, #3b82f6, #ec4899)';
                            element.style.webkitBackgroundClip = 'text';
                            element.style.backgroundClip = 'text';
                            element.style.webkitTextFillColor = 'transparent';
                            element.style.color = 'initial';
                          }}
                        >
                          Blue-Pink Gradient
                        </Button>
                        <Button
                          variant="outline"
                          className="text-left justify-start"
                          onClick={() => {
                            const element = document.getElementById('text-effect-preview');
                            if (element === null) {
                              return;
                            }
                            element.style.background = 'linear-gradient(45deg, #f59e0b, #ef4444)';
                            element.style.webkitBackgroundClip = 'text';
                            element.style.backgroundClip = 'text';
                            element.style.webkitTextFillColor = 'transparent';
                            element.style.color = 'initial';
                          }}
                        >
                          Amber-Red Gradient
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-medium">Text Effect Preview</h3>
                  <div
                    id="text-effect-preview"
                    className="p-6 border rounded-lg"
                    style={{
                      fontFamily: `${selectedFont}, sans-serif`,
                      fontSize: `${fontSize * 1.5}px`,
                      fontWeight: fontWeight,
                      textAlign: textAlign,
                      textTransform: textTransform,
                      wordSpacing: `${wordSpacing}em`,
                      color: activeColors.primary,
                      backgroundColor: activeColors.background,
                    }}
                  >
                    {sampleText || 'Sample Text for Effects'}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      className="p-4 border rounded-lg"
                      style={{ marginBottom: `${paragraphSpacing}em` }}
                    >
                      <p
                        style={{
                          fontFamily: `${selectedFont}, sans-serif`,
                          textAlign: textAlign,
                          textTransform: textTransform,
                          wordSpacing: `${wordSpacing}em`,
                          color: activeColors.primary,
                        }}
                      >
                        First paragraph with custom spacing. This demonstrates how paragraph spacing
                        affects readability and the overall appearance of blocks of text.
                      </p>
                      <p
                        style={{
                          fontFamily: `${selectedFont}, sans-serif`,
                          textAlign: textAlign,
                          textTransform: textTransform,
                          wordSpacing: `${wordSpacing}em`,
                          color: activeColors.primary,
                          marginTop: `${paragraphSpacing}em`,
                        }}
                      >
                        Second paragraph with the same spacing. The space between paragraphs helps
                        break up content and improves readability when set appropriately.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3
                        style={{
                          fontFamily: `${selectedFont}, sans-serif`,
                          fontWeight: 'bold',
                          marginBottom: '0.5em',
                          color: activeColors.primary,
                        }}
                      >
                        Premium Typography
                      </h3>
                      <div
                        style={{
                          fontFamily: `${selectedFont}, sans-serif`,
                          textAlign: 'justify',
                          hyphens: 'auto',
                          color: activeColors.primary,
                        }}
                      >
                        <p>
                          Typography is the art and technique of arranging type to make written
                          language legible, readable, and appealing when displayed.
                        </p>
                        <p style={{ marginTop: '1em' }}>
                          Good typography enhances the user experience, builds brand recognition,
                          and helps to communicate your message effectively.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Typography Combinations</CardTitle>
          <CardDescription>
            Explore recommended font pairings and typographic combinations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {[
              { title: 'Classic', heading: 'Playfair Display', body: 'Source Serif Pro' },
              { title: 'Modern', heading: 'Montserrat', body: 'Open Sans' },
              { title: 'Minimal', heading: 'Inter', body: 'Inter' },
              { title: 'Creative', heading: 'Poppins', body: 'Roboto' },
            ].map((pair) => (
              <div key={pair.title} className="space-y-2">
                <h3 className="text-lg font-semibold">{pair.title} Combination</h3>
                <div
                  className="p-4 border rounded-lg"
                  style={{
                    backgroundColor: activeColors.background,
                  }}
                >
                  <h2
                    style={{
                      fontFamily: `${pair.heading}, sans-serif`,
                      fontSize: '2rem',
                      color: activeColors.primary,
                      marginBottom: '0.5rem',
                    }}
                  >
                    Heading in {pair.heading}
                  </h2>
                  <p
                    style={{
                      fontFamily: `${pair.body}, sans-serif`,
                      fontSize: '1rem',
                      color: activeColors.primary,
                      marginBottom: '1rem',
                    }}
                  >
                    Body text in {pair.body}. {sampleText} This shows how the heading and body fonts
                    work together.
                  </p>
                  <p
                    style={{
                      fontFamily: `${pair.body}, sans-serif`,
                      fontSize: '1rem',
                      color: activeColors.secondary,
                    }}
                  >
                    Secondary text in {pair.body}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
