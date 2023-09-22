'use client';

import { useState } from 'react';
import {
  Button,
  Center,
  Fieldset,
  Flex,
  Grid,
  Modal,
  NumberInput,
  Paper,
  Slider,
  Space,
  Stack,
} from '@mantine/core';
import { Crossing } from './Crossing';
import { useViewportSize } from '@mantine/hooks';
import { useForm } from '@mantine/form';

export default function Welcome() {
  const [simulations, setSimulations] = useState<Array<{}>>([]);
  const [addingSimulation, setAddingSimulation] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      maxCars: 60,
      speedLimit: 50,
      safetyTime: 1,
      distance: 20,
    },
  });

  const { width } = useViewportSize();

  function handleFormSubmit(values, event) {
    event.preventDefault();
    console.log(values);
    setSimulations((prev) => [...prev, values]);
    setAddingSimulation(false);
  }

  console.log(simulations);

  return (
    <Flex align="center" justify="center" direction="column" pt={200}>
      <Grid>
        {simulations.map((simulation, index) => (
          <Grid.Col span={12} key={`grid-${index}`}>
            <Crossing width={width} {...simulation} key={index} />
          </Grid.Col>
        ))}
      </Grid>
      <Space h={40} />
      <Button onClick={() => setAddingSimulation(true)}>Add simulation</Button>
      <Modal opened={addingSimulation} onClose={() => setAddingSimulation(false)}>
        <Stack>
          <form onSubmit={form.onSubmit((values, event) => handleFormSubmit(values, event))}>
            <NumberInput label="Number of cars" {...form.getInputProps('maxCars')} />
            <Space h={10} />
            <Slider
              min={10}
              max={100}
              step={5}
              label="Speed limit"
              marks={[
                { value: 10, label: '10 km/h' },
                { value: 30, label: '30 km/h' },
                { value: 50, label: '50 km/h' },
                { value: 70, label: '70 km/h' },
                { value: 90, label: '90 km/h' },
              ]}
              {...form.getInputProps('speedLimit')}
            />
            <Space h={40} />
            <Slider
              {...form.getInputProps('safetyTime')}
              min={0.5}
              max={3}
              step={0.1}
              label="Safety time"
              marks={[
                { value: 0.5, label: '0.5s' },
                { value: 1, label: '1s' },
                { value: 1.5, label: '1.5s' },
                { value: 2, label: '2s' },
                { value: 2.5, label: '2.5s' },
                { value: 3, label: '3s' },
              ]}
            />
            <Space h={40} />
            <Slider
              {...form.getInputProps('distance')}
              min={10}
              max={100}
              step={5}
              label="Starting distance"
              marks={[
                { value: 10, label: '10m' },
                { value: 20, label: '20m' },
                { value: 30, label: '30m' },
                { value: 40, label: '40m' },
                { value: 50, label: '50m' },
                { value: 60, label: '60m' },
                { value: 70, label: '70m' },
                { value: 80, label: '80m' },
                { value: 90, label: '90m' },
                { value: 100, label: '100m' },
              ]}
            />
            <Space h={40} />
            <Button type="submit">Add simulation</Button>
          </form>
        </Stack>
      </Modal>
    </Flex>
  );
}
