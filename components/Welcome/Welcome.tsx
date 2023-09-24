'use client';

import { useState } from 'react';
import {
  Button,
  Flex,
  Grid,
  Modal,
  NumberInput,
  Slider,
  Space,
  Stack,
  Table,
  rem,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { ParentSize } from '@visx/responsive';
import { Crossing } from './Crossing';

export default function Welcome() {
  const [simulations, setSimulations] = useState<Array<{}>>([]);
  const [addingSimulation, setAddingSimulation] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      maxCars: 30,
      speedLimit: 50,
      safetyTime: 1,
      distance: 20,
    },
  });

  function handleFormSubmit(values, event) {
    event.preventDefault();
    setSimulations((prev) => [...prev, values]);
    setAddingSimulation(false);
  }

  return (
    <div style={{ width: '100%', maxWidth: rem(1200), margin: 'auto' }}>
      <Flex align="center" justify="center" direction="column" pt={200}>
        <Grid w="100%">
          {simulations.map((simulation, index) => (
            <>
              <Grid.Col span={10} key={`grid-${index}`}>
                <ParentSize>
                  {({ width }) => <Crossing width={width} {...simulation} key={index} />}
                </ParentSize>
              </Grid.Col>
              <Grid.Col span={2} key={`grid-${index}-settings`}>
                <Table fz="xs" withTableBorder>
                  <Table.Tr>
                    <Table.Td>Max cars</Table.Td>
                    <Table.Td>{simulation.maxCars}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Speed limit</Table.Td>
                    <Table.Td>{simulation.speedLimit}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Safety time</Table.Td>
                    <Table.Td>{simulation.safetyTime}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>Starting distance</Table.Td>
                    <Table.Td>{simulation.distance}</Table.Td>
                  </Table.Tr>
                </Table>
              </Grid.Col>
            </>
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
    </div>
  );
}
