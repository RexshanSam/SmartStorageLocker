"""
Management command to seed lockers in the database.
"""

from django.core.management.base import BaseCommand
from apps.lockers.models import Locker
from django.utils import timezone


class Command(BaseCommand):
    help = 'Seeds the database with 20 lockers across 4 locations and 3 sizes'

    def handle(self, *args, **options):
        # Define locations and sizes
        locations = [
            'North Wing - Floor 1',
            'North Wing - Floor 2',
            'South Wing - Floor 1',
            'South Wing - Floor 2',
        ]
        sizes = ['small', 'medium', 'large']

        lockers_created = 0

        for location_idx, location in enumerate(locations):
            for size_idx, size in enumerate(sizes):
                # Create 2 lockers of each size per location (2*4*3 = 24)
                # Actually we want 20 total, so: 5 locations? Wait we have 4 locations
                # Let's do: 5 lockers per location, sizes distributed: small(2), medium(2), large(1)
                pass

        # Let's create exactly 20 lockers with a nice distribution
        # 4 locations, 5 lockers each = 20
        # Sizes: small(2), medium(2), large(1) per location

        locker_number = 1
        for location_idx, location in enumerate(locations):
            # small lockers (2)
            for i in range(2):
                locker_id = f"L{locker_number:03d}"
                Locker.objects.get_or_create(
                    locker_number=locker_id,
                    defaults={
                        'location': location,
                        'size': 'small',
                        'status': 'available',
                    }
                )
                self.stdout.write(f"Created locker {locker_id} - Small - {location}")
                locker_number += 1

            # medium lockers (2)
            for i in range(2):
                locker_id = f"L{locker_number:03d}"
                Locker.objects.get_or_create(
                    locker_number=locker_id,
                    defaults={
                        'location': location,
                        'size': 'medium',
                        'status': 'available',
                    }
                )
                self.stdout.write(f"Created locker {locker_id} - Medium - {location}")
                locker_number += 1

            # large locker (1)
            locker_id = f"L{locker_number:03d}"
            Locker.objects.get_or_create(
                locker_number=locker_id,
                defaults={
                    'location': location,
                    'size': 'large',
                    'status': 'available',
                }
            )
            self.stdout.write(f"Created locker {locker_id} - Large - {location}")
            locker_number += 1

        total = Locker.objects.count()
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created/seeded lockers. Total lockers in database: {total}')
        )
